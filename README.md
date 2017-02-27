# README
```
______               _     
| ___ \             | |    
| |_/ /__  __ _  ___| |__  
|  __/ _ \/ _` |/ __| '_ \ 
| | |  __/ (_| | (__| | | |
\_|  \___|\__,_|\___|_| |_|
                CLIENT


License:    GPLv3
Authors:    Christian Bierstedt
            Henry Müssemann
```

## Peach Concept

Read about the [Peach concept](https://github.com/PeachProject/PeachStandalone)!

## Peach Client Concept

### Server

The main peach frontend is a flask server. The flask server will use the PeachShared submodule to communicate to the peach backend.

## Setting up PeachClient

To set up peach client you will have to do the following steps:

### Understand the Peach Concept

1. Please make sure you have understood the [Peach concept](https://github.com/PeachProject/PeachStandalone) and have set up the backend properly (mysql / kafka / PeachBackend / ...).
2. Gather all IPs and ports. You will need them later on...

No idea? Maybe you should think about cloning the [PeachStandalone Git](https://github.com/PeachProject/PeachStandalone)


### Installation of Prerequisites
  1. Install the latest version of Flask ([Flask Installation](http://flask.pocoo.org/docs/0.12/installation/))
  2. Install the LDAP python module

  ```
  $ sudo apt-get install libsasl2-dev python-dev libldap2-dev libssl-dev
  $ sudo pip install python-ldap
  ```

  3. Install kafka-python:

  ```
  $ pip install kafka-python
  ```

  4. [Install Apache Avro for Python](https://avro.apache.org/docs/1.7.6/gettingstartedpython.html)
  5. Clone this repository
  6. Init all submodules

  ```
  $ git submodule init
  $ git submodule update
  ```

### Adapt configs

  1. Copy `flaskServer/config/flaskServerConfig.sample.py` to `flaskServer/config/flaskServerConfig.py`

  ```
  $ cp flaskServer/config/flaskServerConfig.sample.py flaskServer/config/flaskServerConfig.py
  ```

  2. Adapt the newly created file (e.g. `$ vim flaskServer/config/flaskServerConfig.py`):

  ```
  Replace

  "<PeachClient_Git_Repo>": The directory of this file (e.g. /home/peach/PeachClient)
  "<peach_temp_data>": The shared storage (See basic concept)
  "<mysql_*>": The mysql information
  "<current_domain>": The current domain (e.g. http://localhost:5000 !<-no ending backslash!)
  ```

  3. Copy `PeachShared/library/config/peachSharedConfig.sample.py` to `PeachShared/library/config/peachSharedConfig.py`

  ```
  $ cp PeachShared/library/config/peachSharedConfig.sample.py PeachShared/library/config/peachSharedConfig.py
  ```

  4. Adapt the newly created file (e.g. `$ vim PeachShared/library/config/peachSharedConfig.py`):

  ```
  Replace

  "<PeachClient_Git_Repo>": The directory of this file (e.g. /home/peach/PeachClient)
  "<peach_temp_data>": The shared storage (See basic concept)
  "<kafka_server>": The kafka server address (e.g. localhost:9092)
  ```

### Start the flask server
  1. Set `FLASK_APP` environment variable in terminal

  ```
  $ export FLASK_APP=app.py
  ```

  2. Start the flask server

  ```
  $ cd flaskServer
  $ flask run
  ```