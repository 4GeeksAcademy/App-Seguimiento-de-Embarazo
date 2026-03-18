from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from flask_bcrypt import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(nullable=False)

    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    apellido: Mapped[str] = mapped_column(String(100), nullable=False)

    altura: Mapped[float] = mapped_column(Float,nullable=True)
    fecha_nacimiento: Mapped[Date] = mapped_column(Date,nullable=True)

    fecha_registro: Mapped[Date] = mapped_column(Date, default=date.today)

    activo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=True)

    embarazo = relationship("Embarazo", back_populates="usuario", uselist=False)
    registros = relationship("RegistroDiario", back_populates="usuario")
    recordatorios = relationship("Recordatorio", back_populates="usuario")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password).decode('utf-8')

    def check_password(self,password):
        return check_password_hash(self.password_hash, password)

  


    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }