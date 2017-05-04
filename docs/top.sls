# Random top file

base:
  '*':
    - test
    - edit
  'minion 1':
    - match: glob
    - foo
  'os:Ubuntu':
    - match: grain
    - repos.ubuntu
