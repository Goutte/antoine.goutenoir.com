# Require any additional compass plugins here.
# Set this to the root of your project when deployed:
# http_path = "/"
#css_dir = "stylesheets"
#sass_dir = "src"
#images_dir = "images"
#javascripts_dir = "javascripts"
# To enable relative paths to assets via compass helper functions. Uncomment:
# relative_assets = true
#color_output = false



# ==============================================================================
# REQUIRED 3RD PARTY COMPASS EXTENSIONS
# ==============================================================================
#require 'susy'

# ==============================================================================
# COMPASS PROJECT CONFIGURATION
# ==============================================================================

# Can be `:stand_alone` or `:rails`. Defaults to `:stand_alone`.
project_type = :stand_alone

# To enable relative paths to assets via compass helper functions.  Please note
# that this will *only* allow you to use relative URLs for the image_url SASS
# function, and not compute relative URLs for you.
#
# Uncomment:
relative_assets       = true

# Indicates whether line comments should be added to compiled css that says
# where the selectors were defined.
line_comments         = false

# The output style for the compiled css.  One of: `:nested`, `:expanded`,
# `:compact`, or`:compressed`.
output_style          = :compact

# ==============================================================================
# COMPASS SOURCE DIRECTORY CONFIGURATION
# ==============================================================================

# Directory containing the SASS source files
sass_dir              = "src"

# Directory where Compass dumps the generated CSS files
css_dir               = "stylesheets"

# Directory where font files use in font-face declarations are stored
fonts_dir             = "fonts"

# Directory where Compass stores the Grid image, and the sites images are stored
images_dir            = "images"

# Directory where the sites' JavaScript file are stored
javascripts_dir       = "js"

# ==============================================================================
# COMPASS TARGET DIRECTORY CONFIGURATION
# ==============================================================================

# The root of all operations, must be set for Compass to work.
http_path             = "/"

# Directory where Compass dumps the generated CSS files
#http_css_path         = http_path + "assets/css"

# Directory where font files use in font-face declarations are stored
http_fonts_path       = http_path + "assets/fonts"

# Directory where Compass stores the Grid image, and the sites images are stored
#http_images_path      = http_path + "assets/img/"

# Directory where the sites' JavaScript file are stored
#http_javascripts_path = http_path + "assets/js"

# ==============================================================================
# THE END
# ==============================================================================