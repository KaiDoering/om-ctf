#!/usr/bin/python

import os
import sqlalchemy
from flask import Flask, request, render_template, g

app = Flask(__name__)
app.secret_key = os.urandom(128)


def init():
    db = sqlalchemy.create_engine(
        sqlalchemy.engine.url.URL.create(
            drivername="mysql+pymysql",
            username='proxy',
            password=None,
            host='127.0.0.1',
            port='3306',
            database='phone-book',
        ),
    ).connect()
    db.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, address TEXT, phone TEXT, password TEXT);')
    with app.open_resource('users.sql', mode='r') as f:
        db.execute(f.read())
    db.close()

def get_db() -> sqlalchemy.engine.base.Engine:
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlalchemy.create_engine(
            sqlalchemy.engine.url.URL.create(
                drivername="mysql+pymysql",
                username='phone-book-user',
                password=None,
                host='127.0.0.1',
                port='3306',
                database='phone-book',
            ),
        ).connect()
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def query_db(query):
    cur = get_db().execute(query)
    rv = cur.fetchall()
    cur.close()
    return rv if rv else None

@app.route('/', methods=['GET', 'POST'])
def index_page():
    if request.method == 'GET':
        return render_template('index.html')
    else:
        query = request.form.get('q')
        if query is None:
            err = 'Please specify a query'
            return render_template('index.html', err=err)

        query = query.lower()
        q = 'select name, address, phone from users where name like \'%s%%%%\' order by name;' % query
        try:
            result = query_db(q)
        except Exception as err:
            return render_template('index.html', err=err)
        if result is None:
            return render_template('index.html', no_result=True, query=query)
    return render_template('index.html', result=result)


if __name__ == '__main__':
    init()
    app.run(host='0.0.0.0', port=(os.getenv('PORT') if os.getenv('PORT') is not None else 8080))
