"""
API Routes - Unified Pregnancy App (DAM & 4Geeks Edition)
Optimized for Chart.js and Dynamic Dashboards.
"""
import os
import requests
import io
from datetime import datetime, date, timedelta
from flask import request, jsonify, Blueprint, send_file
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import func, select
from fpdf import FPDF
from api.models import db, User, Embarazo, RegistroDiario, Sintomas, Contact, TamanioBebe, ConsejoPorSemana, Recordatorio

api = Blueprint('api', __name__)
CORS(api)

MENSAJES_SEMANALES = {
    1: "Todo comienza con un pequeño sueño. ¡Bienvenida a esta aventura!",
    2: "Tu cuerpo está preparando el hogar más dulce del mundo.",
    3: "Un milagro invisible está ocurriendo ahora mismo dentro de ti.",
    4: "¡Confirmado! Tu aventura oficial como mamá comienza hoy.",
    5: "Su pequeño corazón empieza a latir. ¡Siente la magia!",
    6: "Tu bebé ya tiene el tamaño de un granito de arroz. ¡Qué tierno!",
    7: "Eres el universo entero para alguien que aún no conoces.",
    8: "Tu cuerpo es sabio y fuerte. Confía en el proceso.",
    9: "Esa sonrisa que tendrás al verlo por primera vez ya se está dibujando.",
    10: "Ya no es un embrión, ¡ahora es oficialmente un feto! Un gran paso.",
    11: "Tu felicidad es la de tu bebé. Regálate un momento de paz hoy.",
    12: "¡Fin del primer trimestre! Eres una campeona, lo peor ya pasó.",
    13: "Tu bebé ya tiene huellas dactilares únicas. ¡Es especial!",
    14: "Tu energía está volviendo. ¡Es hora de brillar!",
    15: "Cada día que pasa, estás más cerca de ese primer abrazo.",
    16: "¡Ya puede oírte! Cuéntale lo mucho que lo esperas.",
    17: "Sus huesitos se están fortaleciendo. Come sano y descansa.",
    18: "¡Esas maripositas en tu vientre son sus primeros movimientos!",
    19: "Tu conexión con tu bebé crece con cada latido.",
    20: "¡Mitad del camino! Mira todo lo que has logrado.",
    21: "Tu bebé ya tiene cejas. ¡Imagínate su carita!",
    22: "Eres el refugio más seguro y cálido que existe.",
    23: "Escucha música suave, tu bebé disfruta de los sonidos contigo.",
    24: "¡Ya es viable! Un gran hito en su desarrollo.",
    25: "Tu cuerpo está haciendo un trabajo increíble. ¡Eres hermosa!",
    26: "Sus ojos ya se abren. Pronto verá el mundo a través de los tuyos.",
    27: "¡Bienvenida al tercer trimestre! La recta final comienza ahora.",
    28: "Tu bebé ya sueña. ¿Estará soñando con tus caricias?",
    29: "Cada estiramiento suyo es un recordatorio de que estás acompañada.",
    30: "Falta muy poco. Prepárate con amor y calma.",
    31: "Tu fuerza interior no tiene límites. ¡Falta menos!",
    32: "Tu bebé ya se coloca para conocerte. ¡Hacen un gran equipo!",
    33: "El amor de tu vida está terminando de prepararse.",
    34: "Descansa todo lo que puedas, te lo mereces.",
    35: "Tu hogar pronto tendrá un nuevo sonido: su risa.",
    36: "¡Casi a término! Cada día es un regalo de espera.",
    37: "Todo está listo. Tu cuerpo sabe qué hacer.",
    38: "La emoción está en el aire. ¡Cualquier momento es el momento!",
    39: "Respira profundo. Estás a punto de vivir el día más feliz.",
    40: "¡Llegó la hora! El amor más puro está por nacer. ¡Tú puedes!"
}


def calcular_curva_ideal(peso_inicial, altura_cm):
    """Genera los 41 puntos de la curva verde basados en el IMC inicial (Rangos IOM)"""
    try:
        altura_m = altura_cm / 100
        imc_inicial = peso_inicial / (altura_m ** 2)

        if imc_inicial < 18.5:
            ganancia_total = 15.0
        elif imc_inicial < 25:
            ganancia_total = 13.5
        elif imc_inicial < 30:
            ganancia_total = 9.0
        else:
            ganancia_total = 7.0

        curva_ideal = []
        for semana in range(41):
            if semana <= 12:
                ganancia = (semana / 12) * 1.5
            else:
                semanas_restantes = semana - 12
                tasa_semanal = (ganancia_total - 1.5) / 28
                ganancia = 1.5 + (semanas_restantes * tasa_semanal)
            curva_ideal.append(round(peso_inicial + ganancia, 2))
        return curva_ideal
    except:
        return [peso_inicial] * 41


def obtener_datos_salud(peso_inicial, altura):
    try:
        altura_m = altura / 100
        imc = peso_inicial / (altura_m ** 2)
        if imc < 18.5:
            return round(imc, 1), "Aumento recomendado: 12.5 - 18 kg."
        elif 18.5 <= imc <= 24.9:
            return round(imc, 1), "Aumento recomendado: 11.5 - 16 kg."
        elif 25 <= imc <= 29.9:
            return round(imc, 1), "Aumento recomendado: 7 - 11.5 kg."
        else:
            return round(imc, 1), "Aumento recomendado: 5 - 9 kg."
    except:
        return 0, "Datos de altura/peso incompletos."



@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email y contraseña requeridos"}), 400
    if User.query.filter_by(email=data.get("email")).first():
        return jsonify({"error": "El usuario ya existe"}), 400
    new_user = User(email=data.get("email"), nombre=data.get(
        "nombre", ""), apellido=data.get("apellido", ""))
    new_user.set_password(data.get("password"))
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "Usuario creado con éxito"}), 201


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get("email")).first()
    if not user or not user.check_password(data.get("password")):
        return jsonify({"error": "Credenciales inválidas"}), 401
    token = create_access_token(identity=str(user.id))
    embarazo = Embarazo.query.filter_by(usuario_id=user.id).first()
    return jsonify({"token": token, "user": user.serialize(), "tiene_embarazo": embarazo is not None}), 200

# --- EMBARAZO ---


@api.route('/registro-embarazo', methods=['POST'])
@api.route('/embarazo', methods=['POST'])
@jwt_required()
def registrar_embarazo():
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        embarazo = Embarazo.query.filter_by(usuario_id=user_id).first()
        fecha_str = data.get('ultima_menstruacion') or data.get('fecha_fum')
        if not fecha_str:
            return jsonify({"error": "Fecha FUM requerida"}), 400
        fecha_fum = datetime.strptime(fecha_str, '%Y-%m-%d').date()
        if not embarazo:
            embarazo = Embarazo(usuario_id=user_id)
            db.session.add(embarazo)
        embarazo.ultima_menstruacion = fecha_fum
        embarazo.fecha_parto_estimada = fecha_fum + timedelta(days=280)
        embarazo.peso_inicial = float(data.get('peso_inicial', 0))
        embarazo.altura = float(data.get('altura', 0))
        embarazo.longitud_ciclo = int(data.get('longitud_ciclo', 28))
        embarazo.numero_bebes = int(data.get('numero_bebes', 1))
        db.session.commit()
        return jsonify({"msg": "Configuración guardada correctamente", "tiene_embarazo": True}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 400

# --- DASHBOARD DINÁMICO ---


@api.route('/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    user_id = get_jwt_identity()
    embarazo = Embarazo.query.filter_by(usuario_id=user_id).first()

    if not embarazo:
        return jsonify({"embarazo_configurado": False}), 200

    hoy = date.today()
    dias_transcurridos = (hoy - embarazo.ultima_menstruacion).days
    semana_actual = max(1, min((dias_transcurridos // 7) + 1, 40))
    dias_restantes = max(0, (embarazo.fecha_parto_estimada - hoy).days)

    info_bebe = TamanioBebe.query.filter_by(semana=semana_actual).first()
    respaldo_bebe = {
        4: {"fruta": "una semilla de amapola", "icono": "🌱", "cm": 0.1, "g": 0.1},
        12: {"fruta": "una ciruela", "icono": "🫐", "cm": 5.4, "g": 14},
        20: {"fruta": "un plátano", "icono": "🍌", "cm": 25.6, "g": 300},
        40: {"fruta": "una sandía", "icono": "🍉", "cm": 51.2, "g": 3400}
    }
    if info_bebe:
        bebe_data = {"tamanio": info_bebe.fruta, "icono": getattr(
            info_bebe, 'icono', "✨"), "tamano_cm": info_bebe.tamano_cm, "peso_g": getattr(info_bebe, 'peso_g', 0)}
    else:
        semanas_keys = sorted(respaldo_bebe.keys())
        closest_sem = min(semanas_keys, key=lambda x: abs(x - semana_actual))
        res = respaldo_bebe[closest_sem]
        bebe_data = {"tamanio": res["fruta"], "icono": res["icono"],
                     "tamano_cm": res["cm"], "peso_g": res["g"]}

    registros = RegistroDiario.query.filter_by(
        usuario_id=user_id).order_by(RegistroDiario.fecha.asc()).all()
    curva_ideal_completa = calcular_curva_ideal(
        embarazo.peso_inicial, embarazo.altura)
    chart_labels = [f"Sem {i}" for i in range(41)]

    data_reales = [None] * 41
    data_reales[0] = embarazo.peso_inicial
    for r in registros:
        sem_reg = (r.fecha - embarazo.ultima_menstruacion).days // 7
        if 0 <= sem_reg <= 40:
            data_reales[sem_reg] = r.peso

    frecuencia_sintomas = {s: 0 for s in [
        "nauseas", "fatiga", "dolor_espalda", "hinchazon", "acidez", "insomnio", "calambres", "antojos"]}
    for r in registros:
        if r.sintomas:
            for s in frecuencia_sintomas.keys():
                if getattr(r.sintomas, s, False):
                    frecuencia_sintomas[s] += 1

    imc, consejo_salud = obtener_datos_salud(
        embarazo.peso_inicial, embarazo.altura)
    ultimo_peso = next((p for p in reversed(data_reales)
                       if p is not None), embarazo.peso_inicial)

    return jsonify({
        "embarazo_configurado": True,
        "semana_actual": semana_actual,
        "dias_restantes": dias_restantes,
        "peso_inicial": embarazo.peso_inicial,
        "mensaje": MENSAJES_SEMANALES.get(semana_actual, "¡Disfruta el proceso!"),
        "bebe": bebe_data,
        "salud": {
            "imc_inicial": imc,
            "consejo": consejo_salud,
            "aumento_total": round(ultimo_peso - embarazo.peso_inicial, 1),
            "fpp": embarazo.fecha_parto_estimada.strftime("%d %b, %Y")
        },
        "progreso": max(0, min(round((dias_transcurridos / 280) * 100), 100)),
        "chart_config": {
            "labels": chart_labels,
            "data": data_reales,
            "ideal_data": curva_ideal_completa
        },
        "frecuencia_sintomas": frecuencia_sintomas
    }), 200

# --- REGISTRO DIARIO ---


@api.route('/registro-diario', methods=['POST'])
@jwt_required()
def crear_registro():
    user_id = get_jwt_identity()
    body = request.get_json()
    if not body or "peso" not in body:
        return jsonify({"error": "El campo peso es obligatorio"}), 400
    try:
        nuevo_registro = RegistroDiario(
            usuario_id=user_id, peso=float(body["peso"]), estado_animo=body.get("estado_animo", "Feliz"),
            horas_sueno=float(body.get("horas_sueno", 0)), ejercicio_minutos=int(body.get("ejercicio_minutos", 0)),
            vasos_agua=int(body.get("vasos_agua", 0)), patadas_bebe=int(body.get("patadas_bebe", 0)), notas=body.get("notas", "")
        )
        db.session.add(nuevo_registro)
        db.session.flush()
        if "sintomas" in body:
            s_data = body["sintomas"]
            nuevos_sintomas = Sintomas(
                registro_id=nuevo_registro.id, nauseas=s_data.get("nauseas", False), fatiga=s_data.get("fatiga", False),
                dolor_espalda=s_data.get("dolor_espalda", False), hinchazon=s_data.get("hinchazon", False),
                acidez=s_data.get("acidez", False), insomnio=s_data.get("insomnio", False),
                calambres=s_data.get("calambres", False), antojos=s_data.get("antojos", False)
            )
            db.session.add(nuevos_sintomas)
        db.session.commit()
        return jsonify({"msg": "Registro creado con éxito", "registro": nuevo_registro.serialize()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Error interno al guardar"}), 500


@api.route('/registro-diario/<int:registro_id>', methods=['DELETE'])
@jwt_required()
def delete_registro(registro_id):
    user_id = get_jwt_identity()
    registro = RegistroDiario.query.filter_by(
        id=registro_id, usuario_id=user_id).first()
    if not registro:
        return jsonify({"error": "No encontrado"}), 404
    try:
        db.session.delete(registro)
        db.session.commit()
        return jsonify({"msg": "Registro eliminado"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# --- EXPORTAR PDF ACTUALIZADO ---


@api.route('/exportar-pdf', methods=['GET'])
@jwt_required()
def exportar_pdf():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    embarazo = Embarazo.query.filter_by(usuario_id=user_id).first()
    
    if not user or not embarazo: 
        return jsonify({"error": "No hay datos de embarazo"}), 404
    
    registros = RegistroDiario.query.filter_by(usuario_id=user_id).order_by(RegistroDiario.fecha.desc()).all()
    hoy = date.today()

    semana_actual = max(1, min(((hoy - embarazo.ultima_menstruacion).days // 7) + 1, 42))
    imc_inicial, nota_medica = obtener_datos_salud(embarazo.peso_inicial, embarazo.altura)  
    ultimo_peso = registros[0].peso if registros else embarazo.peso_inicial 
    ganancia_total = round(ultimo_peso - embarazo.peso_inicial, 1) 

    pdf = FPDF()
    pdf.add_page()
    
    # --- ENCABEZADO ---
    pdf.set_font("Arial", 'B', 16)
    pdf.set_text_color(99, 102, 241)
    pdf.cell(190, 10, txt="INFORME MÉDICO DE SEGUIMIENTO", ln=True, align='C')
    
    pdf.set_font("Arial", size=10)
    pdf.set_text_color(0, 0, 0)
    pdf.cell(190, 10, txt=f"Generado el: {hoy.strftime('%d/%m/%Y')}", ln=True, align='R')
    pdf.ln(5)

    # --- 1. RESUMEN DEL EMBARAZO --- 
    pdf.set_fill_color(240, 240, 240)
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(190, 8, " 1. RESUMEN DEL EMBARAZO", ln=True, fill=True)
    pdf.set_font("Arial", size=10)
    pdf.ln(2)
    pdf.cell(95, 7, f"Paciente: {user.nombre} {user.apellido}") 
    pdf.cell(95, 7, f"F.U.M: {embarazo.ultima_menstruacion.strftime('%d/%m/%Y')}", ln=True) 
    pdf.cell(95, 7, f"Semana de Gestación: {semana_actual}") 
    pdf.cell(95, 7, f"F.P.P (Estimada): {embarazo.fecha_parto_estimada.strftime('%d/%m/%Y')}", ln=True) 
    pdf.ln(5)

    # --- 2. CONTROL BIOMÉTRICO --- 
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(190, 8, " 2. CONTROL BIOMÉTRICO", ln=True, fill=True)
    pdf.set_font("Arial", size=10)
    pdf.ln(2)
    pdf.cell(63, 7, f"Peso Inicial: {embarazo.peso_inicial} kg") 
    pdf.cell(63, 7, f"Peso Actual: {ultimo_peso} kg")
    
    # Destacar la ganancia de peso
    pdf.set_font("Arial", 'B', 10)
    pdf.cell(63, 7, f"Ganancia Total: {'+' if ganancia_total >= 0 else ''}{ganancia_total} kg", ln=True) # 
    
    pdf.set_font("Arial", size=10)
    pdf.cell(63, 7, f"IMC Inicial: {imc_inicial}") # 
    pdf.set_font("Arial", 'I', 10)
    pdf.cell(127, 7, f"Nota médica: {nota_medica}", ln=True) 
    pdf.ln(5)

    # --- 3. SÍNTOMAS MÁS RECURRENTES --- 
    frecuencia = {s: 0 for s in ["nauseas", "fatiga", "dolor_espalda", "hinchazon", "acidez", "insomnio", "calambres", "antojos"]}
    for r in registros:
        if r.sintomas:
            for s in frecuencia.keys():
                if getattr(r.sintomas, s, False): frecuencia[s] += 1
    
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(190, 8, " 3. SÍNTOMAS MÁS RECURRENTES", ln=True, fill=True)
    pdf.set_font("Arial", size=10)
    pdf.ln(2)
    for s, count in frecuencia.items():
        if count > 0:
            pdf.cell(190, 6, f"- {s.replace('_', ' ').capitalize()}: Detectado en {count} registros.", ln=True)
    pdf.ln(5)

    # --- 4. HISTORIAL DETALLADO --- 
    pdf.set_font("Arial", 'B', 12)
    pdf.cell(190, 8, " 4. HISTORIAL DETALLADO", ln=True, fill=True)
    pdf.ln(2)
    
    pdf.set_fill_color(99, 102, 241)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(25, 8, "Fecha", 1, 0, 'C', True)
    pdf.cell(20, 8, "Peso", 1, 0, 'C', True)
    pdf.cell(15, 8, "Agua", 1, 0, 'C', True)
    pdf.cell(20, 8, "Sueño", 1, 0, 'C', True)
    pdf.cell(15, 8, "Mov.", 1, 0, 'C', True)
    pdf.cell(95, 8, "Ánimo y Notas", 1, 1, 'C', True)

    pdf.set_text_color(0, 0, 0)
    pdf.set_font("Arial", size=9)
    for r in registros:
        info_extra = f"[{r.estado_animo}] {r.notas or ''}"
        
        pdf.cell(25, 7, r.fecha.strftime('%d/%m/%y'), 1, 0, 'C') # 
        pdf.cell(20, 7, f"{r.peso}kg", 1, 0, 'C') # 
        pdf.cell(15, 7, f"{r.vasos_agua}", 1, 0, 'C') # 
        pdf.cell(20, 7, f"{r.horas_sueno}h", 1, 0, 'C') # 
        pdf.cell(15, 7, f"{r.patadas_bebe}", 1, 0, 'C') # 
        pdf.cell(95, 7, info_extra[:50], 1, 1, 'L') # 

    pdf_content = pdf.output(dest='S').encode('latin-1', 'replace')
    return send_file(io.BytesIO(pdf_content), mimetype='application/pdf', as_attachment=True, download_name=f"Seguimiento_{user.nombre}.pdf")


# --- CONTACTO, CONSEJOS Y RECORDATORIOS ---


@api.route('/contact', methods=['POST'])
def create_contact():
    data = request.get_json()
    new_contact = Contact(email=data.get("email"),
                          description=data.get("description"))
    db.session.add(new_contact)
    db.session.commit()
    return jsonify({"msg": "Mensaje enviado"}), 200


@api.route('/consejos/<int:semana>', methods=['GET'])
def get_consejo(semana):
    consejo = ConsejoPorSemana.query.filter_by(semana=semana).first()
    if not consejo:
        return jsonify({"msg": "No hay consejo"}), 404
    return jsonify(consejo.serialize()), 200


@api.route('/recordatorios', methods=['GET'])
@jwt_required()
def get_recordatorios():
    user_id = get_jwt_identity()
    recordatorios = Recordatorio.query.filter_by(usuario_id=user_id).all()
    return jsonify([r.serialize() for r in recordatorios]), 200


@api.route('/recordatorios', methods=['POST'])
@jwt_required()
def add_recordatorio():
    user_id = get_jwt_identity()
    data = request.get_json()
    nuevo = Recordatorio(usuario_id=user_id, titulo=data.get("titulo"), descripcion=data.get("description"),
                         fecha_hora=datetime.fromisoformat(data.get("fecha_hora")))
    db.session.add(nuevo)
    db.session.commit()
    return jsonify(nuevo.serialize()), 201


@api.route('/recordatorios/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_recordatorio(id):
    user_id = get_jwt_identity()
    rec = Recordatorio.query.filter_by(id=id, usuario_id=user_id).first()
    if not rec:
        return jsonify({"error": "No encontrado"}), 404
    db.session.delete(rec)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201


# OBTENER EMBARAZO

@api.route('/embarazo/<int:user_id>', methods=['GET'])
def obtener_embarazo(user_id):

    embarazo = db.session.execute(
        select(Embarazo).where(Embarazo.usuario_id == user_id)
    ).scalar_one_or_none()

    if embarazo is None:
        return jsonify({"error": "Pregnancy not found"}), 404

    data = embarazo.serialize()

    if embarazo.fecha_ultima_menstruacion:
        data["fecha_ultima_menstruacion"] = embarazo.fecha_ultima_menstruacion.isoformat()

    if embarazo.fecha_parto_estimada:
        data["fecha_parto_estimada"] = embarazo.fecha_parto_estimada.isoformat()

    return jsonify(data), 200



# OBTENER REGISTROS

@api.route('/registro-diario/<int:user_id>', methods=['GET'])
def obtener_registros(user_id):

    registros = db.session.execute(
        select(RegistroDiario).where(RegistroDiario.usuario_id == user_id)
    ).scalars().all()

    resultado = []

    for registro in registros:
        data = registro.serialize()

        if registro.fecha:
            data["fecha"] = registro.fecha.isoformat()
        if registro.fecha_actual:
            data["fecha_actual"] = registro.fecha_actual.isoformat()

        resultado.append(data)

    return jsonify(resultado), 200


# ACTUALIZAR REGISTRO

@api.route('/registro-diario/<int:registro_id>', methods=['PUT'])
def actualizar_registro(registro_id):

    data = request.get_json()

    registro = db.session.get(RegistroDiario, registro_id)

    if registro is None:
        return jsonify({"error": "Register not found"}), 404

    if "peso" in data:
        registro.peso = data["peso"]

    if "estado_animo" in data:
        registro.estado_animo = data["estado_animo"]

    if "nivel_energia" in data:
        registro.nivel_energia = data["nivel_energia"]

    if "ejercicio_minutos" in data:
        registro.ejercicio_minutos = data["ejercicio_minutos"]

    if "notas" in data:
        registro.notas = data["notas"]

    db.session.commit()

    return jsonify({
        "msg": "Register updated",
        "registro": registro.serialize()
    }), 200


# CREAR SINTOMAS

@api.route('/sintomas', methods=['POST'])
def crear_sintomas():

    data = request.get_json()

    registro_id = data.get("registro_id")

    if not registro_id:
        return jsonify({"error": "registro_id required"}), 400

    nuevos_sintomas = Sintomas(
        registro_id=registro_id,
        nauseas=data.get("nauseas"),
        fatiga=data.get("fatiga"),
        dolor_espalda=data.get("dolor_espalda"),
        hinchazon=data.get("hinchazon")
    )

    db.session.add(nuevos_sintomas)
    db.session.commit()

    return jsonify({
        "msg": "Symptoms saved",
        "sintomas": nuevos_sintomas.serialize()
    }), 201


# OBTENER SINTOMAS

@api.route('/sintomas/<int:registro_id>', methods=['GET'])
def obtener_sintomas(registro_id):

    sintomas = db.session.execute(
        select(Sintomas).where(Sintomas.registro_id == registro_id)
    ).scalar_one_or_none()

    if sintomas is None:
        return jsonify({"error": "Symptoms not found"}), 404

    return jsonify(sintomas.serialize()), 200



# HISTORIAL COMPLETO
@api.route('/historial-completo/<int:user_id>', methods=['GET'])
def historial_completo(user_id):

    embarazo = db.session.execute(
        select(Embarazo).where(Embarazo.usuario_id == user_id)
    ).scalar_one_or_none()

    registros = db.session.execute(
        select(RegistroDiario).where(RegistroDiario.usuario_id == user_id)
    ).scalars().all()

    registros_data = []

    for registro in registros:

        sintomas = db.session.execute(
            select(Sintomas).where(Sintomas.registro_id == registro.id)
        ).scalar_one_or_none()

        registro_data = registro.serialize()

        if registro.fecha:
            registro_data["fecha"] = registro.fecha.isoformat()
        if registro.fecha_actual:
            registro_data["fecha_actual"] = registro.fecha_actual.isoformat()

        registro_data["sintomas"] = sintomas.serialize() if sintomas else None

        registros_data.append(registro_data)

    embarazo_data = None

    if embarazo:
        embarazo_data = embarazo.serialize()

        if embarazo.fecha_ultima_menstruacion:
            embarazo_data["fecha_ultima_menstruacion"] = embarazo.fecha_ultima_menstruacion.isoformat()

        if embarazo.fecha_parto_estimada:
            embarazo_data["fecha_parto_estimada"] = embarazo.fecha_parto_estimada.isoformat()
            

    return jsonify({
        "embarazo": embarazo_data,
        "registros": registros_data
    }), 200


# SINTOMAS POR USUARIO

@api.route('/sintomas-usuario/<int:user_id>', methods=['GET'])
def sintomas_por_usuario(user_id):

    registros = db.session.execute(
        select(RegistroDiario).where(RegistroDiario.usuario_id == user_id)
    ).scalars().all()

    resultado = []

    for registro in registros:

        sintomas = db.session.execute(
            select(Sintomas).where(Sintomas.registro_id == registro.id)
        ).scalar_one_or_none()

        if sintomas:

            resultado.append({
                "fecha": registro.fecha.isoformat() if registro.fecha else None,
                "fecha": registro.fecha_actual.isoformat() if registro.fecha_actual else None,
                "sintomas": sintomas.serialize()
            })

    return jsonify(resultado), 200

    # CALCULAR TRIMESTRE API



@api.route('/calcular-trimestre/<int:user_id>', methods=['GET'])
def calcular_trimestre(user_id):

    embarazo = db.session.execute(
        select(Embarazo).where(Embarazo.usuario_id == user_id)
    ).scalar_one_or_none()

    if embarazo is None:
        return jsonify({"error": "Pregnancy not found"}), 404

    lmp = embarazo.fecha_ultima_menstruacion.isoformat()

    url = "https://pregnancy-calculator-api.p.rapidapi.com/trimester-calculator"

    headers = {
        "x-rapidapi-host": "pregnancy-calculator-api.p.rapidapi.com",
        "x-rapidapi-key": os.getenv("RAPIDAPI_KEY")
    }

    params = {
        "lmp": lmp
    }

    response = requests.get(url, headers=headers, params=params)

    if response.status_code != 200:
        return jsonify({"error": "External API error"}), 500

    data = response.json()

    return jsonify({
        "lmp": lmp,
        "trimester_info": data
    }), 200

# CALCULAR FECHA DE PARTO API

@api.route('/fecha-parto/<int:user_id>', methods=['GET'])
def calcular_due_date(user_id):

    embarazo = db.session.execute(
        select(Embarazo).where(Embarazo.usuario_id == user_id)
    ).scalar_one_or_none()

    if embarazo is None:
        return jsonify({"error": "Pregnancy not found"}), 404

    lmp = embarazo.fecha_ultima_menstruacion.isoformat()

    url = "https://pregnancy-calculator-api.p.rapidapi.com/due-date-calculator"

    headers = {
        "x-rapidapi-host": "pregnancy-calculator-api.p.rapidapi.com",
        "x-rapidapi-key": os.getenv("RAPIDAPI_KEY")
    }

    params = {
        "lmp": lmp
    }

    response = requests.get(url, headers=headers, params=params)

    if response.status_code != 200:
        return jsonify({"error": "External API error"}), 500

    return jsonify(response.json()), 200


# CALCULAR SEMANA DE EMBARAZO API
@api.route('/semana-embarazo/<int:user_id>', methods=['GET'])
def calcular_semana_embarazo(user_id):

    embarazo = db.session.execute(
        select(Embarazo).where(Embarazo.usuario_id == user_id)
    ).scalar_one_or_none()

    if embarazo is None:
        return jsonify({"error": "Pregnancy not found"}), 404

    lmp = embarazo.fecha_ultima_menstruacion.isoformat()

    url = "https://pregnancy-calculator-api.p.rapidapi.com/pregnancy-week"

    headers = {
        "x-rapidapi-host": "pregnancy-calculator-api.p.rapidapi.com",
        "x-rapidapi-key": os.getenv("RAPIDAPI_KEY")
    }

    params = {
        "lmp": lmp
    }

    response = requests.get(url, headers=headers, params=params)

    if response.status_code != 200:
        return jsonify({"error": "External API error"}), 500

    return jsonify(response.json()), 200


# ********TAMANIO BEBE************

@api.route('/tamanio-bebe/<int:semana>', methods=['GET'])
def obtener_tamano_bebe(semana):

    tamano = db.session.execute(
        select(TamanioBebe).where(TamanioBebe.semana == semana)
    ).scalar_one_or_none()

    if tamano is None:
        return jsonify({"error": "No data for this week"}), 404

    return jsonify(tamano.serialize()), 200


# ********GENERAR INFORME PDF*******

@api.route('/generar-informe/<int:user_id>', methods=['GET'])
def generar_informe(user_id):

    embarazo = db.session.execute(
        select(Embarazo).where(Embarazo.usuario_id == user_id)
    ).scalar_one_or_none()

    registros = db.session.execute(
        select(RegistroDiario).where(RegistroDiario.usuario_id == user_id)
    ).scalars().all()

    if embarazo is None:
        return jsonify({"error": "Pregnancy not found"}), 404

    buffer = BytesIO()

    pdf = canvas.Canvas(buffer, pagesize=letter)

    pdf.drawString(100, 750, "Pregnancy Monitoring Report")

    y = 700

    pdf.drawString(100, y, f"LMP: {embarazo.fecha_ultima_menstruacion}")
    y -= 20

    if embarazo.fecha_parto_estimada:
        pdf.drawString(100, y, f"Due Date: {embarazo.fecha_parto_estimada}")
        y -= 20

    y -= 20

    pdf.drawString(100, y, "Daily Records:")
    y -= 20

    for r in registros:

        texto = f"Date: {r.fecha} | Weight: {r.peso} | Energy: {r.nivel_energia}"

        pdf.drawString(100, y, texto)

        y -= 20

    pdf.save()

    buffer.seek(0)

    return send_file(
        buffer,
        as_attachment=True,
        download_name="pregnancy_report.pdf",
        mimetype="application/pdf"
    )

    # VER GRÁFICA PESO


@api.route('/grafica-peso/<int:user_id>', methods=['GET'])
def grafica_peso(user_id):

    registros = db.session.execute(
        select(RegistroDiario).where(RegistroDiario.usuario_id == user_id)
    ).scalars().all()

    grafica = generar_grafica_peso(registros)

    if grafica is None:
        return jsonify({"error": "No weight data"}), 404

    return send_file(grafica, mimetype="image/png")


@api.route('/info-bebe/<int:user_id>', methods=['GET'])
def info_bebe(user_id):

    embarazo = db.session.execute(
        select(Embarazo).where(Embarazo.usuario_id == user_id)
    ).scalar_one_or_none()

    if embarazo is None:
        return jsonify({"error": "Pregnancy not found"}), 404

    lmp = embarazo.fecha_ultima_menstruacion.isoformat()

    url = "https://pregnancy-calculator-api.p.rapidapi.com/pregnancy-week"

    headers = {
        "x-rapidapi-host": "pregnancy-calculator-api.p.rapidapi.com",
        "x-rapidapi-key": os.getenv("RAPIDAPI_KEY")
    }

    params = {
        "lmp": lmp
    }

    response = requests.get(url, headers=headers, params=params)

    if response.status_code != 200:
        return jsonify({"error": "External API error"}), 500

    data = response.json()

    semana = data.get("week")

    tamano = db.session.execute(
        select(TamanioBebe).where(TamanioBebe.semana == semana)
    ).scalar_one_or_none()

    fruta = None
    tamano_cm = None

    if tamano:
        fruta = tamano.fruta
        tamano_cm = tamano.tamano_cm

    return jsonify({
        "semana": semana,
        "fruta": fruta,
        "tamano_cm": tamano_cm
    }), 200


# *******DASHBOARD*********

@api.route('/dashboard/<int:user_id>', methods=['GET'])
def dashboard(user_id):

    embarazo = db.session.execute(
        select(Embarazo).where(Embarazo.usuario_id == user_id)
    ).scalar_one_or_none()

    if embarazo is None:
        return jsonify({"error": "Pregnancy not found"}), 404

    registros = db.session.execute(
        select(RegistroDiario)
        .where(RegistroDiario.usuario_id == user_id)
        .order_by(RegistroDiario.fecha.desc())
    ).scalars().all()

    ultimo_registro = registros[0] if registros else None

    lmp = embarazo.fecha_ultima_menstruacion.isoformat()

    url = "https://pregnancy-calculator-api.p.rapidapi.com/pregnancy-week"

    headers = {
        "x-rapidapi-host": "pregnancy-calculator-api.p.rapidapi.com",
        "x-rapidapi-key": os.getenv("RAPIDAPI_KEY")
    }

    params = {
        "lmp": lmp
    }

    response = requests.get(url, headers=headers, params=params)

    semana = None

    if response.status_code == 200:
        semana = response.json().get("week")

    fruta = None
    tamano_cm = None

    if semana:

        tamano = db.session.execute(
            select(TamanioBebe).where(TamanioBebe.semana == semana)
        ).scalar_one_or_none()

        if tamano:
            fruta = tamano.fruta
            tamano_cm = tamano.tamano_cm

    sintomas = None

    if ultimo_registro:

        sintomas_obj = db.session.execute(
            select(Sintomas).where(Sintomas.registro_id == ultimo_registro.id)
        ).scalar_one_or_none()

        if sintomas_obj:
            sintomas = sintomas_obj.serialize()

    return jsonify({

        "embarazo": {
            "lmp": embarazo.fecha_ultima_menstruacion,
            "due_date": embarazo.fecha_parto_estimada,
            "numero_bebes": embarazo.numero_bebes
        },

        "bebe": {
            "semana": semana,
            "fruta": fruta,
            "tamano_cm": tamano_cm
        },

        "ultimo_registro": ultimo_registro.serialize() if ultimo_registro else None,

        "sintomas": sintomas,

        "total_registros": len(registros)

    }), 200

# ****PESO RECOMENDADO DURANTE EMBARAZO*******


@api.route('/peso-recomendado/<int:user_id>', methods=['GET'])
def peso_recomendado(user_id):

    user = db.session.get(User, user_id)

    embarazo = db.session.execute(
        select(Embarazo).where(Embarazo.usuario_id == user_id)
    ).scalar_one_or_none()

    if user is None or embarazo is None:
        return jsonify({"error": "User or pregnancy not found"}), 404

    if user.altura is None:
        return jsonify({"error": "User height required"}), 400

    lmp = embarazo.fecha_ultima_menstruacion.isoformat()

    url_week = "https://pregnancy-calculator-api.p.rapidapi.com/pregnancy-week"

    headers = {
        "x-rapidapi-host": "pregnancy-calculator-api.p.rapidapi.com",
        "x-rapidapi-key": os.getenv("RAPIDAPI_KEY")
    }

    params_week = {
        "lmp": lmp
    }

    response_week = requests.get(url_week, headers=headers, params=params_week)

    if response_week.status_code != 200:
        return jsonify({"error": "Week API error"}), 500

    semana = response_week.json().get("week")

    primer_registro = db.session.execute(
        select(RegistroDiario)
        .where(RegistroDiario.usuario_id == user_id)
        .order_by(RegistroDiario.fecha.asc())
    ).scalars().first()

    if primer_registro is None:
        return jsonify({"error": "No weight data available"}), 400

    peso_inicial = primer_registro.peso

    url = "https://pregnancy-calculator-api.p.rapidapi.com/pwr"

    params = {
        "pre_pregnancy_weight": peso_inicial,
        "height": user.altura,
        "gestational_age": semana
    }

    response = requests.get(url, headers=headers, params=params)

    if response.status_code != 200:
        return jsonify({"error": "External API error"}), 500

    return jsonify(response.json()), 200

# **********Grafica Comparativa Pesos *****************

@api.route('/grafica-peso-comparado/<int:user_id>', methods=['GET'])
def grafica_peso_comparado(user_id):

    user = db.session.get(User, user_id)

    registros = db.session.execute(
        select(RegistroDiario)
        .where(RegistroDiario.usuario_id == user_id)
        .order_by(RegistroDiario.fecha.asc())
    ).scalars().all()

    if not registros:
        return jsonify({"error": "No records"}), 404

    peso_inicial = registros[0].peso

    peso_recomendado = peso_inicial + 12

    grafica = generar_grafica_peso_comparado(registros, peso_recomendado)

    if grafica is None:
        return jsonify({"error": "No weight data"}), 404

    return send_file(grafica, mimetype="image/png")

    

@api.route('/registroEmbarazo', methods=['POST'])
def registroEmbarazo():
    data = request.get_json()

    embarazo_id = data.get("embarazo_id")
    ultima_menstruacion = data.get("ultima_menstruacion")
    peso_inicial = data.get("peso_inicial")
    longitud_ciclo = data.get("longitud_ciclo")

    if not longitud_ciclo  or not ultima_menstruacion:
        return jsonify({"error": "Datos incorretos"}), 400

    registro_embarazo = RegistroEmbarazo(
        embarazo_id=embarazo_id,
        ultima_menstruacion=ultima_menstruacion,
        peso_inicial=peso_inicial,
        longitud_ciclo=longitud_ciclo
    )

    db.session.add(registro_embarazo)
    db.session.commit()

    return jsonify({"msg": "Registro creado correctamente"}), 201

