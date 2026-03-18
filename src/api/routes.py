"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""

from flask import request, jsonify, Blueprint
from api.models import db, User, Embarazo, RegistroDiario, Sintomas, ConsejoPorSemana, TamanioBebe, Contact, RegistroEmbarazo
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask import request, jsonify, Blueprint
from api.models import db, User, Embarazo, RegistroDiario, Sintomas, ConsejoPorSemana, TamanioBebe, Contact
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
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import select  





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
