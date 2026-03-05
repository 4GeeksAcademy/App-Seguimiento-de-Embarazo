from flask_sqlalchemy import SQLAlchemy
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


    def set_password(self, password):
        self.password_hash = generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
  
    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }
    
class RegistroEmbarazo(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    embarazo_id: Mapped[int] = mapped_column(ForeignKey("embarazo.id"))
    

    name: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    ultima_fecha_menstruacion: Mapped[datetime] = mapped_column(Date, nullable=False)
    pesoInicioEmbarazo: Mapped[float] = mapped_column(Float, nullable=False)
    cicloMestrual: Mapped[int] = mapped_column(nullable=False)


    def serialize(self):
        return {
            "id": self.id,
            "embarazo_id": self.embarazo_id,
            "name": self.name,
            "ultimaFechaMestruacion": self.ultimaFechaMestruacion,
            "pesoInicioEmbarazo": self.pesoInicioEmbarazo,
            "cicloMestrual": self.cicloMestrual,

            # do not serialize the password, its a security breach
        }
    


