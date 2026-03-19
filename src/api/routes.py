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
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from fpdf import FPDF
from flask import send_file
from api.models import db, User, Embarazo, RegistroDiario, Sintomas, Contact, TamanioBebe, ConsejoPorSemana

api = Blueprint('api', __name__)
CORS(api)

# --- DICCIONARIO DE MENSAJES MOTIVACIONALES ---
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

# --- LÓGICA DE SALUD E IMC ---


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

# --- AUTH ---


@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email y contraseña requeridos"}), 400

    if User.query.filter_by(email=data.get("email")).first():
        return jsonify({"error": "El usuario ya existe"}), 400

    new_user = User(
        email=data.get("email"),
        nombre=data.get("nombre", ""),
        apellido=data.get("apellido", "")
    )
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
    return jsonify({
        "token": token,
        "user": user.serialize(),
        "tiene_embarazo": embarazo is not None
    }), 200

# --- MEJORA 1: ALIAS PARA EVITAR EL ERROR 405 ---


@api.route('/registro-embarazo', methods=['POST'])
# <--- Añadido para que coincida con el fetch del front
@api.route('/embarazo', methods=['POST'])
@jwt_required()
def registrar_embarazo():
    user_id = get_jwt_identity()
    data = request.get_json()
    try:
        embarazo = Embarazo.query.filter_by(usuario_id=user_id).first()

        # Soporte para ambos nombres de campo (front y back)
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

    # 1. Tiempos
    hoy = date.today()
    dias_transcurridos = (hoy - embarazo.ultima_menstruacion).days
    semana_actual = max(1, min((dias_transcurridos // 7) + 1, 42))
    dias_restantes = max(0, (embarazo.fecha_parto_estimada - hoy).days)

    # 2. Frutas
    frutas_dict = {1: "Semilla 🌱", 4: "Amapola 📍", 8: "Frambuesa 🍓", 12: "Lima 🍋", 16: "Aguacate 🥑",
                   20: "Plátano 🍌", 25: "Berenjena 🍆", 30: "Pepino 🥒", 35: "Coco 🥥", 40: "Sandía 🍉"}
    ref = max([s for s in frutas_dict.keys() if s <= semana_actual] or [1])

    # 3. Registros y Gráficas
    imc, consejo = obtener_datos_salud(embarazo.peso_inicial, embarazo.altura)
    registros = RegistroDiario.query.filter_by(
        usuario_id=user_id).order_by(RegistroDiario.fecha.asc()).all()

    frecuencia_sintomas = {"nauseas": 0, "fatiga": 0,
                           "dolor_espalda": 0, "hinchazon": 0}
    chart_labels = ["Inicial"]
    chart_data = [embarazo.peso_inicial]

    for r in registros:
        if r.peso:
            chart_labels.append(r.fecha.strftime("%d/%m"))
            chart_data.append(r.peso)
        if r.sintomas:
            for s in frecuencia_sintomas.keys():
                if getattr(r.sintomas, s, False):
                    frecuencia_sintomas[s] += 1

    peso_actual = chart_data[-1] if chart_data else embarazo.peso_inicial

    return jsonify({
        "embarazo_configurado": True,
        "semana_actual": semana_actual,
        "dias_restantes": dias_restantes,
        "mensaje": MENSAJES_SEMANALES.get(semana_actual, "Disfruta cada segundo de este viaje."),
        "bebe": {"tamanio": frutas_dict[ref]},
        "detalles": {
            "ultima_menstruacion": embarazo.ultima_menstruacion.isoformat(),
            "peso_inicial": embarazo.peso_inicial,
            "altura": embarazo.altura
        },
        "salud": {
            "imc_inicial": imc,
            "consejo": consejo,
            "aumento_total": round(peso_actual - embarazo.peso_inicial, 1),
            "fpp": embarazo.fecha_parto_estimada.strftime("%d %b, %Y")
        },
        "progreso": max(0, min(round((dias_transcurridos / 280) * 100), 100)),
        "chart_config": {"labels": chart_labels, "data": chart_data},
        "frecuencia_sintomas": frecuencia_sintomas
    }), 200

# --- REGISTRO DIARIO ---


@api.route('/registro-diario', methods=['POST'])
@jwt_required()
def post_registro():
    user_id = get_jwt_identity()
    body = request.get_json()
    hoy = date.today()

    # 1. Buscamos si ya existe un registro hoy para no duplicar
    registro = RegistroDiario.query.filter(
        RegistroDiario.usuario_id == user_id,
        db.func.date(RegistroDiario.fecha) == hoy
    ).first()

    # 2. Si no existe, lo creamos
    if not registro:
        registro = RegistroDiario(
            usuario_id=user_id,
            fecha=hoy,
            estado_animo="Feliz"  # Valor por defecto
        )
        db.session.add(registro)
        db.session.flush()  # Esto genera el ID necesario para la tabla de Síntomas

    # 3. Actualizamos los campos básicos (incluyendo sueño y ejercicio)
    if body.get("peso"):
        registro.peso = float(body["peso"])

    registro.estado_animo = body.get("estado_animo", "Feliz")
    registro.notas = body.get("notas", "")

    # NUEVOS CAMPOS: Asegúrate de que existan en tu models.py
    registro.horas_sueno = float(body.get("horas_sueno", 8))
    registro.ejercicio_minutos = int(body.get("ejercicio_minutos", 0))

    # 4. Actualizamos los síntomas (la lista ahora tiene los 8 que pide el Dashboard)
    if "sintomas" in body:
        if not registro.sintomas:
            # Si no tiene objeto de síntomas vinculado, lo creamos
            registro.sintomas = Sintomas(registro_id=registro.id)

        # Lista completa de síntomas sincronizada con el Frontend
        lista_sintomas = [
            "nauseas", "fatiga", "dolor_espalda", "hinchazon",
            "acidez", "insomnio", "calambres", "antojos"
        ]

        for s in lista_sintomas:
            # Usamos setattr para asignar el valor booleano dinámicamente
            val = body["sintomas"].get(s, False)
            setattr(registro.sintomas, s, val)

    # 5. Guardamos todo
    try:
        db.session.commit()
        return jsonify({
            "msg": "¡Progreso diario guardado correctamente! ✨",
            "registro": registro.serialize()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# --- EXPORTAR PDF ---


@api.route('/exportar-pdf', methods=['GET'])
@jwt_required()
def exportar_pdf():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    registros = RegistroDiario.query.filter_by(
        usuario_id=user_id).order_by(RegistroDiario.fecha.desc()).all()

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", 'B', 16)
    pdf.cell(
        200, 10, txt=f"Informe de Embarazo - {user.nombre}", ln=True, align='C')

    pdf.set_font("Arial", size=12)
    pdf.ln(10)
    pdf.cell(200, 10, txt=f"Email: {user.email}", ln=True)
    pdf.cell(
        200, 10, txt=f"Semana actual: {user.embarazo.semana_actual if user.embarazo else 'N/A'}", ln=True)

    pdf.ln(10)
    pdf.cell(200, 10, txt="HISTORIAL DIARIO", ln=True, align='L')
    pdf.line(10, pdf.get_y(), 200, pdf.get_y())

    for r in registros:
        pdf.ln(5)
        txt_registro = f"Fecha: {r.fecha.strftime('%d/%m/%Y')} | Peso: {r.peso}kg | Agua: {r.vasos_agua} | Patadas: {r.patadas_bebe}"
        pdf.cell(200, 10, txt=txt_registro, ln=True)
        if r.notas:
            pdf.set_font("Arial", 'I', 10)
            pdf.cell(200, 10, txt=f"Notas: {r.notas}", ln=True)
            pdf.set_font("Arial", size=12)

    pdf_output = f"informe_{user_id}.pdf"
    pdf.output(pdf_output)
    return send_file(pdf_output, as_attachment=True)

# --- CONTACTO ---


@api.route('/contact', methods=['POST'])
def create_contact():
    data = request.get_json()
    if not data.get("email") or not data.get("description"):
        return jsonify({"error": "Datos incompletos"}), 400
    new_contact = Contact(email=data.get("email"),
                          description=data.get("description"))
    db.session.add(new_contact)
    db.session.commit()
    return jsonify({"msg": "Mensaje enviado con éxito"}), 200
