import json
import os

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado

import tiledb.cloud

from .extension import TileDBHandler  # noqa: F401


class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        TOKEN = os.getenv("TILEDB_REST_TOKEN")
        API_HOST = os.getenv("TILEDB_REST_HOST")
        self.finish(json.dumps({"token": TOKEN, "api_host": API_HOST}))


def setup_handlers(web_app):
    host_pattern = ".*$"

    # Register handlers for all cloud endpoints (for user and user's organizations)
    profile = tiledb.cloud.client.user_profile()
    tiledb_cloud_base = "/api/contents/cloud/owned/{}"
    route_patterns = []
    route_patterns.append(tiledb_cloud_base.format(profile.username))

    for organization in profile.organizations:
        route_patterns.append(tiledb_cloud_base.format(organization.organization_name))

    for url in route_patterns:
        rp = url_path_join(web_app.settings["base_url"], url)
        web_app.add_handlers(host_pattern, [(rp, TileDBHandler)])

    # Register handler for /get_access_token endpoint
    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(base_url, "get_access_token")
    handlers = [(route_pattern, RouteHandler)]
    web_app.add_handlers(host_pattern, handlers)
