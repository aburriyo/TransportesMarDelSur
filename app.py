from flask import Flask, render_template, send_from_directory, request, redirect
import os

app = Flask(__name__)

# Force HTTPS in production (disabled temporarily until SSL is configured)
# @app.before_request
# def force_https():
#     if not app.debug:
#         if request.headers.get('X-Forwarded-Proto', 'http') == 'http':
#             url = request.url.replace('http://', 'https://', 1)
#             return redirect(url, code=301)

# Custom error handlers
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template('404.html'), 500

# Main landing page
@app.route('/')
def home():
    return render_template('home.html')

# Services page
@app.route('/servicios')
def servicios():
    return render_template('services.html')

# Certifications page
@app.route('/certificaciones')
def certificaciones():
    return render_template('certifications.html')

# Fleet page
@app.route('/flota')
def flota():
    return render_template('fleet.html')

# FAQ page
@app.route('/faq')
def faq():
    return render_template('faq.html')

# Contact page
@app.route('/contacto')
def contacto():
    return render_template('contact.html')

# About page
@app.route('/nosotros')
def nosotros():
    return render_template('about.html')

# Legacy route - redirect old single page (keep for backwards compatibility)
@app.route('/index')
def index():
    return render_template('index.html')

# SEO files
@app.route('/robots.txt')
def robots():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'robots.txt', mimetype='text/plain')

@app.route('/sitemap.xml')
def sitemap():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'sitemap.xml', mimetype='application/xml')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
