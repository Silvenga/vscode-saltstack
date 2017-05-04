# Random collection of states
# This is a comment, don't parse!

install_network_packages:
  pkg.installed:
    - pkgs:
      - rsync
      - lftp
      - curl

python-pip:
  cmd.run:
    - name: |
        easy_install --script-dir=/usr/bin -U pip
    - cwd: /
    - reload_modules: true

pep8:
  pip.installed:
    - require:
      - cmd: python-pip