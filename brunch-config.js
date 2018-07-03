// See http://brunch.io for documentation.

exports.npm = {
  enabled: true,
  styles: {
    bootstrap: ["dist/css/bootstrap.css"]
  }
};

exports.files = {
  javascripts: {
    joinTo: {
      'vendor.js': /^(?!app)/, // Files that are not in `app` dir.
      'app.js': /^app/
    }
  },
  stylesheets: {
    joinTo: {
      "vendor.css": /^(?!app)/,
      "app.css": /^app/
    }
  }
};

exports.plugins = {
  babel: { presets: ['latest'] }
};
