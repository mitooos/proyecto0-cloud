from flask import Flask, request, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_restful import Api, Resource
from flask_jwt_extended import (
        JWTManager,
        create_access_token,
        get_jwt_identity,
        jwt_required,
)
import enum
from datetime import datetime

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'abrete-sesamo'
app.config['JWT_SECRET_KEY'] = 'abrete-sesamo2'
db = SQLAlchemy(app)
jwt = JWTManager(app)
ma = Marshmallow(app)
api = Api(app)

# model
class User(db.Model):
    email = db.Column(db.String(128), primary_key=True)
    password = db.Column(db.String(128))
    
class Evento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(128))
    categoria = db.Column(db.String(128))
    lugar = db.Column(db.String(128))
    direccion = db.Column(db.String(128))
    fecha_inicio = db.Column(db.DateTime)
    fecha_fin = db.Column(db.DateTime)
    presencial = db.Column(db.Boolean)
    user_email = db.Column(db.String(128), db.ForeignKey(User.email), nullable=False)
    
    def validate_categoria(self):
        categorias = {
                'conferencia':1,
                'seminario': 1,
                'congreso': 1,
                'curso': 1        
                }
        try:
            categorias[self.categoria]
        except:
            return False
        return True

# schemas (dto)

class User_Schema(ma.Schema):
    class Meta:
        fields = ('email', 'password')

user_schema = User_Schema()
users_schema = User_Schema(many=True)

class  Evento_Schema(ma.Schema):
    class Meta:
        fields = ('id', 'nombre', 'categoria', 'lugar', 'direccion', 'fecha_inicio', 'fecha_fin', 'presencial')

evento_shema = Evento_Schema()
eventos_shema = Evento_Schema(many=True)

# api

api = Api(app)

class RecursoListarUsuarios(Resource):
    def post(self):
        new_user = User(
                email=request.json['email'],
                password=request.json['password']
                )
        try:
            db.session.add(new_user)
            db.session.commit()
        except:
            response = make_response({'message': 'email already exists'})
            response.status_code = 400
            return response

        token = create_access_token(identity=new_user.email, expires_delta=False)
        return {
                'token':token 
                }

class LoginResource(Resource):
    def post(self):
        email = request.json['email']
        password = request.json['password']
        user = User.query.filter_by(email=email, password=password).first()
        if not user:
            response = make_response()
            response.status_code = 401
            return response

        token = create_access_token(identity=user.email, expires_delta=False)
        return {
                'token': token
                }

class RecursoListarEventos(Resource):
    @jwt_required
    def get(self):
        user_email = get_jwt_identity()
        events = Evento.query.filter_by(user_email=user_email).order_by(Evento.fecha_inicio)
        return eventos_shema.dump(events)

    @jwt_required
    def post(self):
        user_email = get_jwt_identity()
        fecha_inicio = datetime.strptime(request.json['fecha_inicio'], '%Y-%m-%d')
        fecha_fin = datetime.strptime(request.json['fecha_fin'], '%Y-%m-%d')        

        new_event = Evento(
                nombre=request.json['nombre'],
                categoria=request.json['categoria'],
                lugar=request.json['lugar'],
                direccion=request.json['direccion'],
                fecha_inicio=fecha_inicio,
                fecha_fin=fecha_fin,
                presencial=request.json['presencial'],
                user_email=user_email
                )
        if not new_event.validate_categoria():
            response = make_response({'message': 'ingrese una categoria valida'})
            response.status_code = 404
            return response

        try:
            db.session.add(new_event)
            db.session.commit()
        except:
            response = make_response({'message': 'something went wrong'})
            response.status_code = 500
            return response
        return evento_shema.dump(new_event)

class RecursoEvento(Resource):
    @jwt_required
    def get(self, id_evento):
        user_email = get_jwt_identity()
        evento = Evento.query.filter_by(id=id_evento, user_email=user_email).first()
        if not evento:
            response = make_response()
            response.status_code = 404
            return response
        return evento_shema.dump(evento)

    @jwt_required
    def put(self, id_evento):
        user_email = get_jwt_identity()
        evento = Evento.query.filter_by(id=id_evento, user_email=user_email).first()
        if not evento:
            response = make_response()
            response.status_code = 404
            return response

        if 'nombre' in request.json:
            evento.nombre = request.json['nombre']
        if 'categoria' in request.json:
            evento.categoria = request.json['categoria']
        if 'lugar' in request.json:
            evento.lugar = request.json['lugar']
        if 'direccion' in request.json:
            evento.direccion = request.json['direccion']
        if 'fecha_inicio' in request.json:
            fecha_inicio = datetime.strptime(request.json['fecha_inicio'], '%Y-%m-%d')
            evento.fecha_inicio = fecha_inicio 
        if 'fecha_fin' in request.json:
            fecha_fin = datetime.strptime(request.json['fecha_fin'], '%Y-%m-%d') 
            evento.fecha_fin = fecha_fin
        if 'presencial' in request.json:
            evento.presencial = request.json['presencial']

        if not evento.validate_categoria():
            response = make_response({'message': 'ingrese una categoria valida'})
            response.status_code = 404
            return response

        try:
            db.session.commit()
        except:
            response = make_response({'message': 'something went wrong'})
            response.status_code = 500
            return response

        return evento_shema.dump(evento)

    @jwt_required
    def delete(self, id_evento):
        user_email = get_jwt_identity()
        evento = Evento.query.filter_by(id=id_evento, user_email=user_email).first()
        if not evento:
            response = make_response()
            response.status_code = 404
            return response

        db.session.delete(evento)
        db.session.commit()
        return '', 204



api.add_resource(RecursoListarUsuarios, '/usuarios')
api.add_resource(LoginResource, '/auth/login')
api.add_resource(RecursoListarEventos, '/eventos')
api.add_resource(RecursoEvento, '/eventos/<int:id_evento>')

if __name__ == '__main__':
    app.run(debug=True)
