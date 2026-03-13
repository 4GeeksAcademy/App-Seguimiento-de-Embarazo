import click
from api.models import db, User, TamanioBebe, Embarazo, RegistroDiario
from datetime import date

def setup_commands(app):

    @app.cli.command("insert-test-users")
    @click.argument("count")
    def insert_test_users(count):
        print("Creating test users")

        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True

            db.session.add(user)
            db.session.commit()
            print("User:", user.email, "created.")

        print("All test users created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        print("Inserting baby size data...")

        data = [
            (8, 'frambuesa', 1.6), (9, 'cereza', 2.3), (10, 'fresa', 3.1),
            (11, 'lima', 4.1), (12, 'ciruela', 5.4), (13, 'limon', 7.4),
            (14, 'manzana', 8.7), (15, 'naranja', 10.1), (16, 'aguacate', 11.6),
            (17, 'granada', 13), (18, 'mango', 14.2), (19, 'tomate', 15.3),
            (20, 'banana', 16.4), (21, 'zanahoria', 26.7), (22, 'papaya', 27.8),
            (23, 'pomelo', 28.9), (24, 'mazorca', 30), (25, 'coliflor', 34.6),
            (26, 'lechuga', 35.6), (27, 'brocoli', 36.6), (28, 'berenjena', 37.6),
            (29, 'calabaza', 38.6), (30, 'repollo', 39.9), (31, 'coco', 41.1),
            (32, 'piña', 42.4), (33, 'apio', 43.7), (34, 'melon', 45),
            (35, 'melon grande', 46.2), (36, 'lechuga romana', 47.4),
            (37, 'acelga', 48.6), (38, 'calabaza grande', 49.8),
            (39, 'sandia pequeña', 50.7), (40, 'sandia', 51.2)
        ]

        for semana, fruta, tamano in data:
            exists = TamanioBebe.query.filter_by(semana=semana).first()
            if not exists:
                nuevo = TamanioBebe(
                    semana=semana,
                    fruta=fruta,
                    tamano_cm=tamano
                )
                db.session.add(nuevo)

        db.session.commit()
        print("Baby size data inserted successfully")

    @app.cli.command("insert-dashboard-data")
    def insert_dashboard_data():
        print("Creating demo dashboard data...")

        user = User.query.filter_by(email="demo_user@test.com").first()
        if not user:
            user = User(
                email="demo_user@test.com",
                nombre="Demo",
                apellido="User",
                altura=1.65
            )
            user.set_password("123456")
            db.session.add(user)
            db.session.commit()
            print("User created")

        embarazo = Embarazo.query.filter_by(usuario_id=user.id).first()
        if not embarazo:
            embarazo = Embarazo(
                usuario_id=user.id,
                fecha_ultima_menstruacion=date(2026, 1, 1),
                fecha_parto_estimada=date(2026, 10, 8),
                numero_bebes=1,
                doctor="Dr. Smith",
                hospital="Hospital Central",
                primer_embarazo=True,
                activo=True
            )
            db.session.add(embarazo)
            db.session.commit()
            print("Pregnancy created")

        registros = [
            RegistroDiario(
                usuario_id=user.id,
                fecha=date(2026, 3, 1),
                peso=60.5,
                estado_animo="bien",
                nivel_energia=7,
                ejercicio_minutos=20,
                notas="Todo normal"
            ),
            RegistroDiario(
                usuario_id=user.id,
                fecha=date(2026, 3, 10),
                peso=61.2,
                estado_animo="cansada",
                nivel_energia=5,
                ejercicio_minutos=10,
                notas="Algo de fatiga"
            ),
            RegistroDiario(
                usuario_id=user.id,
                fecha=date(2026, 3, 13),
                peso=61.8,
                estado_animo="excelente",
                nivel_energia=9,
                ejercicio_minutos=30,
                notas="Mucha energía hoy"
            )
        ]

        for r in registros:
            exists = RegistroDiario.query.filter_by(usuario_id=user.id, fecha=r.fecha).first()
            if not exists:
                db.session.add(r)

        db.session.commit()
        print("Dashboard demo data ready")