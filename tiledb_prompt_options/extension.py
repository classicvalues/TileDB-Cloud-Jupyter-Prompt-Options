from tornado import gen, web
from .handlers import setup_handlers
from notebook.services.contents.handlers import ContentsHandler, validate_model
from notebook.utils import maybe_future, url_path_join

import tiledb.cloud


class TileDBHandler(ContentsHandler):
    @web.authenticated
    @gen.coroutine
    def post(self, path=""):
        """Create a new file in the specified path.
        POST creates new files. The server always decides on the name.
        POST /api/contents/path
          New untitled, empty file or directory.
        POST /api/contents/path
          with body {"copy_from" : "/path/to/OtherNotebook.ipynb"}
          New copy of OtherNotebook in path

        This post function is able to pass the TileDB options to the
        new_untitled() function in TileDBContentsManager.
        """
        cm = self.contents_manager
        file_exists = yield maybe_future(cm.file_exists(path))
        if file_exists:
            raise web.HTTPError(400, "Cannot POST to files, use PUT instead.")

        dir_exists = yield maybe_future(cm.dir_exists(path))
        if not dir_exists:
            raise web.HTTPError(404, "No such directory: %s" % path)

        model = self.get_json_body()

        if model is not None:
            copy_from = model.get("copy_from")
            nbpath = model.get("path", "")
            ext = model.get("ext", "")
            type = model.get("type", "")
            options = model.get("options", "")
            if copy_from:
                yield self._copy(copy_from, nbpath)
            else:
                yield self._new_untitled(nbpath, type=type, ext=ext, options=options)
        else:
            yield self._new_untitled(path)

    @web.authenticated
    @gen.coroutine
    def get(self, path=""):
        uri = self.request.uri
        base_uri = uri.split("?")[0]
        parts = base_uri.split("/")
        final_path = "/" + "/".join(parts[-3:])
        model = yield maybe_future(self.contents_manager.get(final_path))

        self.set_status(200)
        self._finish_model(model)

    @gen.coroutine
    def _new_untitled(self, path, type="", ext="", options=""):
        """Create a new, empty untitled entity.

        This function passes the TileDB options to the new_untitled() method."""
        self.log.info(u"Creating new %s in %s", type or "file", path)

        model = yield maybe_future(
            self.contents_manager.new_untitled(
                path=path, type=type, ext=ext, options=options
            )
        )
        self.set_status(201)
        validate_model(model, expect_content=False)
        self._finish_model(model)
