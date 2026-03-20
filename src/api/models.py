from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, Date, Float, Text, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from flask_bcrypt import generate_password_hash, check_password_hash
from datetime import date, datetime

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'user'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    nombre: Mapped[str] = mapped_column(String(100), nullable=False)
    apellido: Mapped[str] = mapped_column(String(100), nullable=False)
    altura: Mapped[float] = mapped_column(Float, nullable=True)
    fecha_nacimiento: Mapped[date] = mapped_column(Date, nullable=True)
    fecha_registro: Mapped[date] = mapped_column(Date, default=date.today)
    activo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=True)

    # Relaciones
    embarazo = relationship(
        "Embarazo", back_populates="usuario", uselist=False)
    registros = relationship("RegistroDiario", back_populates="usuario")
    recordatorios = relationship("Recordatorio", back_populates="usuario")
    informes = relationship("Informe", back_populates="usuario")  # Agregada

    @property
    def semana_actual(self):
        """Calcula la semana basándose en la FUM"""
        if self.embarazo and self.embarazo.ultima_menstruacion:
            hoy = date.today()
            dias_transcurridos = (hoy - self.embarazo.ultima_menstruacion).days
            semana = (dias_transcurridos // 7) + 1
            return max(1, min(semana, 42))  # Limita entre semana 1 y 42
        return None

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
            "activo": self.activo,
            "semana_actual": self.semana_actual,  # <-- Añadido
            "tiene_embarazo": self.embarazo is not None  # <-- Añadido
        }


class ConsejoPorSemana(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    semana = db.Column(db.Integer, nullable=False)
    consejo = db.Column(db.String(500), nullable=False)

    def serialize(self):
        return {
            "semana": self.semana,
            "consejo": self.consejo
        }


class Embarazo(db.Model):
    __tablename__ = 'embarazo'
    id: Mapped[int] = mapped_column(primary_key=True)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    ultima_menstruacion: Mapped[date] = mapped_column(Date, nullable=False)
    fecha_parto_estimada: Mapped[date] = mapped_column(Date, nullable=True)
    peso_inicial: Mapped[float] = mapped_column(Float, nullable=False)
    longitud_ciclo: Mapped[int] = mapped_column(Integer, nullable=False)
    numero_bebes: Mapped[int] = mapped_column(Integer, default=1)
    altura: Mapped[float] = mapped_column(Float, nullable=False)

    usuario = relationship("User", back_populates="embarazo")

    def serialize(self):
        return {
            "id": self.id,
            "ultima_menstruacion": self.ultima_menstruacion.isoformat(),
            "fecha_parto_estimada": self.fecha_parto_estimada.isoformat() if self.fecha_parto_estimada else None,
            "peso_inicial": self.peso_inicial,
            "altura": self.altura
        }


class RegistroDiario(db.Model):
    __tablename__ = 'registro_diario'
    id: Mapped[int] = mapped_column(primary_key=True)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    fecha: Mapped[date] = mapped_column(Date, default=date.today)
    peso: Mapped[float] = mapped_column(Float, nullable=True)
    estado_animo: Mapped[str] = mapped_column(String(50))
    vasos_agua: Mapped[int] = mapped_column(Integer, default=0)
    patadas_bebe: Mapped[int] = mapped_column(Integer, default=0)
    horas_sueno: Mapped[float] = mapped_column(Float, default=8.0)
    ejercicio_minutos: Mapped[int] = mapped_column(Integer, default=0)
    notas: Mapped[str] = mapped_column(Text, nullable=True)
    fecha_creacion: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)

    usuario = relationship("User", back_populates="registros")
    sintomas = relationship(
        "Sintomas", back_populates="registro", cascade="all, delete", uselist=False)

    def serialize(self):
        return {
            "id": self.id,
            "fecha": self.fecha.isoformat(),
            "peso": self.peso,
            "estado_animo": self.estado_animo,
            "sintomas": self.sintomas.serialize() if self.sintomas else None
        }


class Sintomas(db.Model):
    __tablename__ = 'sintomas'
    id: Mapped[int] = mapped_column(primary_key=True)
    registro_id: Mapped[int] = mapped_column(ForeignKey("registro_diario.id"))
    nauseas: Mapped[bool] = mapped_column(Boolean, default=False)
    fatiga: Mapped[bool] = mapped_column(Boolean, default=False)
    dolor_espalda: Mapped[bool] = mapped_column(Boolean, default=False)
    hinchazon: Mapped[bool] = mapped_column(Boolean, default=False)
    acidez: Mapped[bool] = mapped_column(Boolean, default=False)
    insomnio: Mapped[bool] = mapped_column(Boolean, default=False)
    calambres: Mapped[bool] = mapped_column(Boolean, default=False)
    antojos: Mapped[bool] = mapped_column(Boolean, default=False)

    registro = relationship("RegistroDiario", back_populates="sintomas")

    def serialize(self):
        return {k: v for k, v in self.__dict__.items() if not k.startswith('_')}


class TamanioBebe(db.Model):
    __tablename__ = 'tamanio_bebe'
    id: Mapped[int] = mapped_column(primary_key=True)
    semana: Mapped[int] = mapped_column(Integer, unique=True, nullable=False)
    fruta: Mapped[str] = mapped_column(String(100))
    icono: Mapped[str] = mapped_column(String(20), nullable=True)
    tamano_cm: Mapped[float] = mapped_column(Float)

    def serialize(self):
        return {
            "semana": self.semana,
            "tamanio": self.fruta,
            "icono": self.icono,
            "cm": self.tamano_cm
        }


class Recordatorio(db.Model):
    __tablename__ = 'recordatorio'
    id: Mapped[int] = mapped_column(primary_key=True)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    titulo: Mapped[str] = mapped_column(String(200))
    descripcion: Mapped[str] = mapped_column(Text)
    fecha_hora: Mapped[datetime] = mapped_column(DateTime)
    completado: Mapped[bool] = mapped_column(Boolean, default=False)

    usuario = relationship("User", back_populates="recordatorios")

    def serialize(self):
        return {
            "id": self.id,
            "titulo": self.titulo,
            "fecha_hora": self.fecha_hora.isoformat() if self.fecha_hora else None,
            "completado": self.completado
        }


class Contact(db.Model):
    __tablename__ = 'contact'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=db.func.now())

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "description": self.description,
            "created_at": self.created_at.isoformat()
        }


class Informe(db.Model):
    __tablename__ = 'informe'
    id: Mapped[int] = mapped_column(primary_key=True)
    usuario_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    fecha_generacion: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)
    tipo_informe: Mapped[str] = mapped_column(String(50))
    datos_json: Mapped[str] = mapped_column(Text)
    url_pdf: Mapped[str] = mapped_column(String(500))

    usuario = relationship("User", back_populates="informes")

    def serialize(self):
        return {
            "id": self.id,
            "fecha_generacion": self.fecha_generacion.isoformat(),
            "tipo_informe": self.tipo_informe,
            "url_pdf": self.url_pdf
        }
