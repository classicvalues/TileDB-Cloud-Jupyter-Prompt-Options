from os import path

from jupyter_packaging import (
    combine_commands,
    create_cmdclass,
    ensure_python,
    ensure_targets,
    install_npm,
)
from setuptools import find_packages, setup

pjoin = path.join

ensure_python(">=3.4")

name = "tiledb_prompt_options"
here = path.abspath(path.dirname(__file__))

requires = [
    "notebook",
    "nose",
    "ipykernel",
    "setuptools>=18.0",
    "setuptools-scm>=1.5.4",
    "setuptools-scm-git-archive",
    "tiledb>=0.7.0",
    "tiledb-cloud>=0.6.7",
]

data_spec = [
    # Lab extension installed by default:
    ("share/jupyter/lab/extensions", "lab-dist", "tiledb_prompt_options-*.tgz"),
    # Config to enable server extension by default:
    ("etc/jupyter", "jupyter-config", "**/*.json"),
]


cmdclass = create_cmdclass("js", data_files_spec=data_spec)
cmdclass["js"] = combine_commands(
    install_npm(here, build_cmd="build:all"),
    ensure_targets(
        [pjoin(here, "lib", "index.js")]
    ),
)

setup(
    name=name,
    use_scm_version={
        "version_scheme": "guess-next-dev",
        "local_scheme": "dirty-tag",
        "write_to": "tiledb_prompt_options/version.py",
    },
    description="TileDB notebook extension to prompt user for notebook options",
    author="TileDB, Inc.",
    license="BSD",
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Programming Language :: Python :: 2",
        "Programming Language :: Python :: 2.7",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Framework :: Jupyter",
    ],
    cmdclass=cmdclass,
    keywords="jupyter jupyterlab",
    packages=find_packages(),
    install_requires=requires,
    include_package_data=True,
    zip_safe=False,
)
