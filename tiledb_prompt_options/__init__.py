from ._version import __version__  # noqa: F401
from .extension import load_jupyter_server_extension  # noqa: F401
from .handlers import setup_handlers


def _jupyter_server_extension_paths():
    return [{"module": "tiledb_prompt_options"}]


def load_jupyter_server_extension(lab_app):
    """Registers the API handler to receive HTTP requests from the frontend extension.
    Parameters
    ----------
    lab_app: jupyterlab.labapp.LabApp
        JupyterLab application instance
    """
    url_path = "get_access_token"
    setup_handlers(lab_app.web_app, url_path)
    lab_app.log.info("Registered route path /{}".format(url_path))
