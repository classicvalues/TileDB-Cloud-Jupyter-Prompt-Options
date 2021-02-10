# TileDB Jupyterlab Prompt User Options

Custom Jupyterlab widget for TileDB to prompt the user for notebook creation options including:

- Notebook name
- S3 Path
- S3 Credentials
- Owner

## Installation

You can install using `pip` and `jupyterlab`:

```bash
pip install tiledb_prompt_options
jupyter labextension install tiledb_prompt_options
```

For development mode, in the top level directory run:

```bash
python setup.py develop
jupyter labextension install .
```