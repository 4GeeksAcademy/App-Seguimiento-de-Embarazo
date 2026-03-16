from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, Date, Float, Text, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from flask_bcrypt import generate_password_hash, check_password_hash
from datetime import date, datetime
from sqlalchemy import String, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from flask_bcrypt import generate_password_hash, check_password_hash
from datetime import date, datetime

from sqlalchemy import String, Float
from sqlalchemy.orm import Mapped, mapped_column
from flask_bcrypt import generate_password_hash, check_password_hash
from sqlalchemy import ForeignKey
from datetime import date, datetime
from sqlalchemy import Column, Integer, String, Date



db = SQLAlchemy()


class User(db.Model):

    id: Mapped[int] = mapped_column(primary_key=True)

    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    nombre: Mapped[str] = mapped_column(String(100), nullable=True)
    apellido: Mapped[str] = mapped_column(String(100), nullable=True)

    altura: Mapped[float] = mapped_column(Float, nullable=True)
    fecha_nacimiento: Mapped[Date] = mapped_column(Date, nullable=True)

    fecha_registro: Mapped[Date] = mapped_column(Date, default=date.today)

    activo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=True)

    embarazo = relationship("Embarazo", back_populates="usuario", uselist=False)
    registros = relationship("RegistroDiario", back_populates="usuario")
    recordatorios = relationship("Recordatorio", back_populates="usuario")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "altura": self.altura,
            "fecha_nacimiento": self.fecha_nacimiento,
            "fecha_registro": self.fecha_registro,
            "activo": self.activo
        }


class Embarazo(db.Model):

    id: Mapped[int] = mapped_column(primary_key=True)

    usuario_id: Mapped[int] = mapped_column(ForeignKey("user.id"))


    fecha_parto_estimada: Mapped[Date] = mapped_column(Date)

    primer_embarazo: Mapped[bool] = mapped_column(Boolean, default=True)

    numero_bebes: Mapped[int] = mapped_column(Integer, default=1)

    doctor: Mapped[str] = mapped_column(String(150))
    hospital: Mapped[str] = mapped_column(String(200))

    activo: Mapped[bool] = mapped_column(Boolean, default=True)

    usuario = relationship("User", back_populates="embarazo")
            # do not serialize the password, its a security breach
        
    
class RegistroEmbarazo(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    embarazo_id: Mapped[int] = mapped_column(ForeignKey("embarazo.id"))
    

   
    ultima_menstruacion: Mapped[datetime] = mapped_column(Date, nullable=False)
    peso_inicial: Mapped[float] = mapped_column(Float, nullable=False)
    longitud_ciclo: Mapped[int] = mapped_column(nullable=False)


    def serialize(self):
        return {
            "id": self.id,
            "embarazo_id": self.embarazo_id,
            "ultima_menstruacion": self.ultima_menstruacion,
            "peso_inicial": self.peso_inicial,
            "longitud_ciclo": self.longitud_ciclo,
           
           
        }


class RegistroDiario(db.Model):

    id: Mapped[int] = mapped_column(primary_key=True)

    usuario_id: Mapped[int] = mapped_column(ForeignKey("user.id"))

    fecha: Mapped[Date] = mapped_column(Date)

    peso: Mapped[float] = mapped_column(Float)

    estado_animo: Mapped[str] = mapped_column(String(50))

    nivel_energia: Mapped[int] = mapped_column(Integer)

    ejercicio_minutos: Mapped[int] = mapped_column(Integer)

    notas: Mapped[str] = mapped_column(Text)

    fecha_creacion: Mapped[DateTime] = mapped_column(DateTime, default=datetime.utcnow)

    usuario = relationship("User", back_populates="registros")

    sintomas = relationship("Sintomas", back_populates="registro", cascade="all, delete")

    def serialize(self):
        return {
            "id": self.id,
            "usuario_id": self.usuario_id,
            "fecha": self.fecha,
            "peso": self.peso,
            "estado_animo": self.estado_animo,
            "nivel_energia": self.nivel_energia,
            "ejercicio_minutos": self.ejercicio_minutos,
            "notas": self.notas
        }


class Sintomas(db.Model):

    id: Mapped[int] = mapped_column(primary_key=True)

    registro_id: Mapped[int] = mapped_column(ForeignKey("registro_diario.id"))

    nauseas: Mapped[bool] = mapped_column(Boolean)
    fatiga: Mapped[bool] = mapped_column(Boolean)
    dolor_espalda: Mapped[bool] = mapped_column(Boolean)
    hinchazon: Mapped[bool] = mapped_column(Boolean)

    registro = relationship("RegistroDiario", back_populates="sintomas")

    def serialize(self):
        return {
            "id": self.id,
            "nauseas": self.nauseas,
            "fatiga": self.fatiga,
            "dolor_espalda": self.dolor_espalda,
            "hinchazon": self.hinchazon
        }


class ConsejoPorSemana(db.Model):

    id: Mapped[int] = mapped_column(primary_key=True)

    semana: Mapped[int] = mapped_column(Integer)

    titulo: Mapped[str] = mapped_column(String(150))

    descripcion: Mapped[str] = mapped_column(Text)

    def serialize(self):
        return {
            "semana": self.semana,
            "titulo": self.titulo,
            "descripcion": self.descripcion
        }


class Recordatorio(db.Model):

    id: Mapped[int] = mapped_column(primary_key=True)

    usuario_id: Mapped[int] = mapped_column(ForeignKey("user.id"))

    titulo: Mapped[str] = mapped_column(String(200))

    descripcion: Mapped[str] = mapped_column(Text)

    fecha_hora: Mapped[DateTime] = mapped_column(DateTime)

    completado: Mapped[bool] = mapped_column(Boolean, default=False)

    usuario = relationship("User", back_populates="recordatorios")

    def serialize(self):
        return {
            "id": self.id,
            "titulo": self.titulo,
            "descripcion": self.descripcion,
            "fecha_hora": self.fecha_hora,
            "completado": self.completado
        }


class Informe(db.Model):

    id: Mapped[int] = mapped_column(primary_key=True)

    usuario_id: Mapped[int] = mapped_column(ForeignKey("user.id"))

    fecha_generacion: Mapped[DateTime] = mapped_column(DateTime, default=datetime.utcnow)

    tipo_informe: Mapped[str] = mapped_column(String(50))

    datos_json: Mapped[str] = mapped_column(Text)

    url_pdf: Mapped[str] = mapped_column(String(500))


class TamanioBebe(db.Model):

    id: Mapped[int] = mapped_column(primary_key=True)

    semana: Mapped[int] = mapped_column(Integer, unique=True, nullable=False)

    fruta: Mapped[str] = mapped_column(String(100))

    tamano_cm: Mapped[float] = mapped_column(Float)

    def serialize(self):
        return {
            "semana": self.semana,
            "fruta": self.fruta,
            "tamano_cm": self.tamano_cm
        }
    
class Contact(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=False)
    created_at: Mapped[str] = mapped_column(db.DateTime, server_default=db.func.now())
  
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None
        } 


class Embarazo(db.Model):

    id: Mapped[int] = mapped_column(primary_key=True)

    usuario_id: Mapped[int] = mapped_column(ForeignKey("user.id"))

    fecha_ultima_menstruacion: Mapped[Date] = mapped_column(Date, nullable=False)

    fecha_parto_estimada: Mapped[Date] = mapped_column(Date)

    primer_embarazo: Mapped[bool] = mapped_column(Boolean, default=True)

    numero_bebes: Mapped[int] = mapped_column(Integer, default=1)

    doctor: Mapped[str] = mapped_column(String(150))
    hospital: Mapped[str] = mapped_column(String(200))

    activo: Mapped[bool] = mapped_column(Boolean, default=True)

    usuario = relationship("User", back_populates="embarazo")

    def serialize(self):
        return {
            "id": self.id,
            "usuario_id": self.usuario_id,
            "fecha_ultima_menstruacion": self.fecha_ultima_menstruacion,
            "fecha_parto_estimada": self.fecha_parto_estimada,
            "numero_bebes": self.numero_bebes,
            "doctor": self.doctor,
            "hospital": self.hospital
        }


class RegistroDiario(db.Model):

    id: Mapped[int] = mapped_column(primary_key=True)

    usuario_id: Mapped[int] = mapped_column(ForeignKey("user.id"))

    fecha: Mapped[Date] = mapped_column(Date)

    peso: Mapped[float] = mapped_column(Float)

    estado_animo: Mapped[str] = mapped_column(String(50))

    nivel_energia: Mapped[int] = mapped_column(Integer)

    ejercicio_minutos: Mapped[int] = mapped_column(Integer)

    notas: Mapped[str] = mapped_column(Text)

    fecha_creacion: Mapped[DateTime] = mapped_column(DateTime, default=datetime.utcnow)

    usuario = relationship("User", back_populates="registros")

    sintomas = relationship("Sintomas", back_populates="registro", cascade="all, delete")

    def serialize(self):
        return {
            "id": self.id,
            "usuario_id": self.usuario_id,
            "fecha": self.fecha,
            "peso": self.peso,
            "estado_animo": self.estado_animo,
            "nivel_energia": self.nivel_energia,
            "ejercicio_minutos": self.ejercicio_minutos,
            "notas": self.notas
        }


class Sintomas(db.Model):

    id: Mapped[int] = mapped_column(primary_key=True)

    registro_id: Mapped[int] = mapped_column(ForeignKey("registro_diario.id"))

    nauseas: Mapped[bool] = mapped_column(Boolean)
    fatiga: Mapped[bool] = mapped_column(Boolean)
    dolor_espalda: Mapped[bool] = mapped_column(Boolean)
    hinchazon: Mapped[bool] = mapped_column(Boolean)

    registro = relationship("RegistroDiario", back_populates="sintomas")

    def serialize(self):
        return {
            "id": self.id,
            "nauseas": self.nauseas,
            "fatiga": self.fatiga,
            "dolor_espalda": self.dolor_espalda,
            "hinchazon": self.hinchazon
        }


class ConsejoPorSemana(db.Model):

    id: Mapped[int] = mapped_column(primary_key=True)

    semana: Mapped[int] = mapped_column(Integer)

    titulo: Mapped[str] = mapped_column(String(150))

    descripcion: Mapped[str] = mapped_column(Text)

    def serialize(self):
        return {
            "semana": self.semana,
            "titulo": self.titulo,
            "descripcion": self.descripcion
        }


class Recordatorio(db.Model):

    id: Mapped[int] = mapped_column(primary_key=True)

    usuario_id: Mapped[int] = mapped_column(ForeignKey("user.id"))

    titulo: Mapped[str] = mapped_column(String(200))

    descripcion: Mapped[str] = mapped_column(Text)

    fecha_hora: Mapped[DateTime] = mapped_column(DateTime)

    completado: Mapped[bool] = mapped_column(Boolean, default=False)

    usuario = relationship("User", back_populates="recordatorios")

    def serialize(self):
        return {
            "id": self.id,
            "titulo": self.titulo,
            "descripcion": self.descripcion,
            "fecha_hora": self.fecha_hora,
            "completado": self.completado
        }


class Informe(db.Model):

    id: Mapped[int] = mapped_column(primary_key=True)

    usuario_id: Mapped[int] = mapped_column(ForeignKey("user.id"))

    fecha_generacion: Mapped[DateTime] = mapped_column(DateTime, default=datetime.utcnow)

    tipo_informe: Mapped[str] = mapped_column(String(50))

    datos_json: Mapped[str] = mapped_column(Text)

    url_pdf: Mapped[str] = mapped_column(String(500))
    
            # do not serialize the password, its a security breach
        

    



