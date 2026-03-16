"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""

from flask import request, jsonify, Blueprint
from api.models import db, User, Embarazo, RegistroDiario, Sintomas, ConsejoPorSemana, TamanioBebe, Contact, RegistroEmbarazo
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, RegistroEmbarazo
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import create_access_token
from datetime import datetime
import os
import requests
import matplotlib.pyplot as plt
from io import BytesIO
from reportlab.lib.pagesizes import letter
from flask import send_file
from reportlab.pdfgen import canvas

from io import BytesIO
from reportlab.lib.pagesizes import letter
from flask import send_file
from reportlab.pdfgen import canvas
from flask_jwt_extended import jwt_required, get_jwt_identity




api = Blueprint('api', __name__)

CORS(api)


# ***Funcion Generar Gráfica Peso***
def generar_grafica_peso(registros):

    fechas = []
    pesos = []

    for r in registros:
        if r.peso and r.fecha:
            fechas.append(r.fecha)
            pesos.append(r.peso)

    if not pesos:
        return None

    plt.figure()

    plt.plot(fechas, pesos, marker="o")

    plt.title("Evolución de Peso")
    plt.xlabel("Fecha")
    plt.ylabel("Peso (kg)")

    buffer = BytesIO()
    plt.savefig(buffer, format="png")
    plt.close()

    buffer.seek(0)

    return buffer


# *******FUNCION GRAFICA COMPARATIVA DE PESOS *************


def generar_grafica_peso_comparado(registros, peso_recomendado):

    semanas = []
    pesos = []
    recomendados = []

    for i, r in enumerate(registros):

        if r.peso:
            semanas.append(i + 1)
            pesos.append(r.peso)
            recomendados.append(peso_recomendado)

    if not pesos:
        return None

    plt.figure()

    plt.plot(semanas, pesos, marker="o", label="Peso real")
    plt.plot(semanas, recomendados, linestyle="--", label="Peso recomendado")

    plt.title("Peso real vs peso recomendado")
    plt.xlabel("Semana")
    plt.ylabel("Peso (kg)")

    plt.legend()

    buffer = BytesIO()
    plt.savefig(buffer, format="png")
    plt.close()

    buffer.seek(0)

    return buffer


# HELLO TEST

@api.route('/hello', methods=['GET'])
def handle_hello():
    return jsonify({
        "message": "Hello! Backend working correctly"
    }), 200


# REGISTER

@api.route('/register', methods=['POST'])
def register():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")
    nombre = data.get("nombre")
    apellido = data.get("apellido")

    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400

    existing_user = db.session.execute(
        select(User).where(User.email == email)
    ).scalar_one_or_none()

    if existing_user:
        return jsonify({"error": "User already exists"}), 400

    new_user = User(
        email=email,
        nombre=nombre,
        apellido=apellido
    )

    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201


# LOGIN

@api.route('/login', methods=['POST'])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "email and password required"}), 400

    existing_user = db.session.execute(
        select(User).where(User.email == email)
    ).scalar_one_or_none()

    if not existing_user:
        return jsonify({"error": "Invalid email or password"}), 400

    if not existing_user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 400

    token = create_access_token(identity=str(existing_user.id))

    return jsonify({
        "msg": "Login successful",
        "token": token,
        "user": existing_user.serialize()
    }), 200


# CREAR EMBARAZO

@api.route('/embarazo', methods=['POST'])
@jwt_required()
def crear_embarazo():

    data = request.get_json()

    usuario_id = get_jwt_identity()

    try:
        ultima_menstruacion = datetime.strptime(
            data.get("ultima_menstruacion"), "%Y-%m-%d"
        ).date()
    except:
        return jsonify({"error": "Invalid fecha_ultima_menstruacion format"}), 400

    peso_inicial = data.get("peso_inicial")
    longitud_ciclo = data.get("longitud_ciclo")
    numero_bebes = data.get("numero_bebes", 1)
    altura = data.get("altura")

   
    
    nuevo_embarazo = Embarazo(
        usuario_id=usuario_id,
        ultima_menstruacion=ultima_menstruacion,
        peso_inicial=peso_inicial,
        longitud_ciclo=longitud_ciclo,
        numero_bebes=numero_bebes,
        altura=altura,
       
    )

    db.session.add(nuevo_embarazo)
    db.session.commit()

    return jsonify({"msg": "Pregnancy created"}), 201


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


# CREAR REGISTRO DIARIO

@api.route('/registro-diario', methods=['POST'])
def crear_registro_diario():

    data = request.get_json()

    usuario_id = data.get("usuario_id")

    try:
        fecha = datetime.strptime(
            data.get("fecha"), "%Y-%m-%d")
        fecha_actual = datetime.strptime(
            data.get("fecha_actual"), "%Y-%m-%d"
        ).date()
    except:
        return jsonify({"error": "Invalid fecha_actual"}), 400

    nuevo_registro = RegistroDiario(
        usuario_id=usuario_id,
        fecha=fecha,
        fecha_actual=fecha_actual,
        peso=data.get("peso"),
        estado_animo=data.get("estado_animo"),
        nivel_energia=data.get("nivel_energia"),
        ejercicio_minutos=data.get("ejercicio_minutos"),
        notas=data.get("notas")
    )

    db.session.add(nuevo_registro)
    db.session.commit()

    return jsonify({"msg": "Register created"}), 201


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


# ELIMINAR REGISTRO

@api.route('/registro-diario/<int:registro_id>', methods=['DELETE'])
def eliminar_registro(registro_id):

    registro = db.session.get(RegistroDiario, registro_id)

    if registro is None:
        return jsonify({"error": "Register not found"}), 404

    sintomas = db.session.execute(
        select(Sintomas).where(Sintomas.registro_id == registro_id)
    ).scalars().all()

    for s in sintomas:
        db.session.delete(s)

    db.session.delete(registro)
    db.session.commit()

    return jsonify({"msg": "Register deleted"}), 200


# CONSEJO POR SEMANA

@api.route('/consejos/<int:semana>', methods=['GET'])
def obtener_consejo(semana):

    consejo = db.session.execute(
        select(ConsejoPorSemana).where(ConsejoPorSemana.semana == semana)
    ).scalar_one_or_none()

    if consejo is None:
        return jsonify({"error": "No advice for this week"}), 404

    return jsonify(consejo.serialize()), 200


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

    peso_recomendado = peso_inicial + 12  # estimación promedio embarazo

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

@api.route('/contact', methods=['POST'])
def create_contact():
    data = request.get_json()
    email = data.get("email")
    description = data.get("description")
    
    if not email or not description:
        return jsonify({"error": "Email and description are required"}), 400

    new_contact = Contact(
        email=email, 
        description=description
    )
    
    db.session.add(new_contact)
    db.session.commit()
    
    return jsonify({"msg": "Contact message sent successfully"}), 200
