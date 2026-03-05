"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, RegistroEmbarazo
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import create_access_token, get_jwt_identity




api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400
    
    existing_user = db.session.execute(select(User).where(
        User.email == email)).scalar_one_or_none()
    

    if existing_user:
        return jsonify({"error": "User with this email alredy exixt"}), 400
    
    new_user = User(email = email)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201


@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"error": "email and password are required"}), 400
    
    existing_user = db.session.execute(select(User).where(
        User.email == email)).scalar_one_or_none()
    
    if existing_user is None:
        return jsonify({"error": "Invalid mail or password"}), 400
    
    if existing_user.check_password(password):
        access_token = create_access_token(identity=str(existing_user.id))
        return jsonify({"msg": "Login successful", "token": access_token, "user": existing_user.serialize()}), 200
    else:
        return jsonify({"error": "Invalid mail or password"}), 400
    

@api.route('/registroEmbarazo', methods=['POST'])
def registroEmbarazo():
    data = request.get_json()

    name = data.get("name")
    ultimaFechaMestruacion = data.get("ultimaFechaMestruacion")
    pesoInicioEmbarazo = data.get("pesoInicioEmbarazo")
    cicloMestrual = data.get("cicloMestrual")

    registro_embarazo = RegistroEmbarazo(
        name=name,
        ultimaFechaMestruacion=ultimaFechaMestruacion,
        pesoInicioEmbarazo=pesoInicioEmbarazo,
        cicloMestrual=cicloMestrual
    )

    db.session.add(registro_embarazo)
    db.session.commit()

    return jsonify({"msg": "Registro creado correctamente"}), 201