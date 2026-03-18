import click
from api.models import db, User, TamanioBebe

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but still in integration 
with your database, for example: Import the price of bitcoin every night as 12am
"""

def setup_commands(app):
    
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
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


    """
    Insert pregnancy baby size data (fruit comparison)
    """
    @app.cli.command("insert-test-data")
    def insert_test_data():

        print("Inserting baby size data...")

        data = [
            (8,'frambuesa',1.6),
            (9,'cereza',2.3),
            (10,'fresa',3.1),
            (11,'lima',4.1),
            (12,'ciruela',5.4),
            (13,'limon',7.4),
            (14,'manzana',8.7),
            (15,'naranja',10.1),
            (16,'aguacate',11.6),
            (17,'granada',13),
            (18,'mango',14.2),
            (19,'tomate',15.3),
            (20,'banana',16.4),
            (21,'zanahoria',26.7),
            (22,'papaya',27.8),
            (23,'pomelo',28.9),
            (24,'mazorca',30),
            (25,'coliflor',34.6),
            (26,'lechuga',35.6),
            (27,'brocoli',36.6),
            (28,'berenjena',37.6),
            (29,'calabaza',38.6),
            (30,'repollo',39.9),
            (31,'coco',41.1),
            (32,'piña',42.4),
            (33,'apio',43.7),
            (34,'melon',45),
            (35,'melon grande',46.2),
            (36,'lechuga romana',47.4),
            (37,'acelga',48.6),
            (38,'calabaza grande',49.8),
            (39,'sandia pequeña',50.7),
            (40,'sandia',51.2)
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