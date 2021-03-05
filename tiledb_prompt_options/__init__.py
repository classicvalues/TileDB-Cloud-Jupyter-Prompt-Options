from ._version import __version__  # noqa: F401
from .extension import TileDBHandler  # noqa: F401
from .handlers import setup_handlers
from notebook.utils import url_path_join

import tiledb.cloud


def _jupyter_server_extension_paths():
    return [{"module": "tiledb_prompt_options"}]


def load_jupyter_server_extension(nb_server_app):
    """
    Called when the extension is loaded.
    """
    web_app = nb_server_app.web_app
    host_pattern = ".*$"

    profile = tiledb.cloud.client.user_profile()
    tiledb_cloud_base = "/api/contents/cloud/owned/{}"
    route_patterns = []

    route_patterns.append(tiledb_cloud_base.format(profile.username))
    token_url_path = "get_access_token"
    setup_handlers(web_app, token_url_path)

    for organization in profile.organizations:
        route_patterns.append(tiledb_cloud_base.format(organization.organization_name))

    for url in route_patterns:
        rp = url_path_join(web_app.settings["base_url"], url)
        web_app.add_handlers(host_pattern, [(rp, TileDBHandler)])

    nb_server_app.log.info(
        "Added content handlers for current user: {}".format(str(route_patterns))
    )
