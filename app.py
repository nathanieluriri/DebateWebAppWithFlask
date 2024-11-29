from flask import Flask, render_template

app = Flask(__name__)


# Home route
@app.route("/")
def home():
    return render_template("index.html")


# Topic route
@app.route("/<string:topic>")
def topic(topic):
    return render_template("topic.html", topic=topic)


# Catch-all route for nested claims
@app.route("/<string:topic>/<path:claimpath>")
def claim(topic, claimpath):
    return render_template("claim.html", topic=topic, claimpath=claimpath)


if __name__ == "__main__":
    app.run(debug=True)
