[
  {
    "description": "",
    "tags": [],
    "loc": {
      "start": {
        "line": 1,
        "column": 0
      },
      "end": {
        "line": 1,
        "column": 6
      }
    },
    "context": {
      "loc": {
        "start": {
          "line": 2,
          "column": 0
        },
        "end": {
          "line": 291,
          "column": 1
        }
      }
    },
    "augments": [],
    "examples": [],
    "params": [],
    "properties": [],
    "returns": [],
    "sees": [],
    "throws": [],
    "todos": [],
    "name": "Player",
    "kind": "class",
    "members": {
      "global": [],
      "inner": [],
      "instance": [
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Method for adding listeners of events inside player.\nYou can check all events inside ",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 2,
                        "column": 33,
                        "offset": 85
                      },
                      "indent": [
                        1
                      ]
                    }
                  },
                  {
                    "type": "inlineCode",
                    "value": "VideoPlayer.UI_EVENTS",
                    "position": {
                      "start": {
                        "line": 2,
                        "column": 33,
                        "offset": 85
                      },
                      "end": {
                        "line": 2,
                        "column": 56,
                        "offset": 108
                      },
                      "indent": []
                    }
                  },
                  {
                    "type": "text",
                    "value": " and ",
                    "position": {
                      "start": {
                        "line": 2,
                        "column": 56,
                        "offset": 108
                      },
                      "end": {
                        "line": 2,
                        "column": 61,
                        "offset": 113
                      },
                      "indent": []
                    }
                  },
                  {
                    "type": "inlineCode",
                    "value": "VideoPlayer.VIDEO_EVENTS",
                    "position": {
                      "start": {
                        "line": 2,
                        "column": 61,
                        "offset": 113
                      },
                      "end": {
                        "line": 2,
                        "column": 87,
                        "offset": 139
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 2,
                    "column": 87,
                    "offset": 139
                  },
                  "indent": [
                    1
                  ]
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 2,
                "column": 87,
                "offset": 139
              }
            }
          },
          "tags": [
            {
              "title": "param",
              "description": "The Event name, such as `VideoPlayer.UI_EVENTS.PLAY_TRIGGERED`",
              "lineNumber": 4,
              "type": null,
              "name": "event"
            },
            {
              "title": "param",
              "description": "A function callback to execute when the event is triggered.",
              "lineNumber": 5,
              "type": null,
              "name": "fn"
            },
            {
              "title": "param",
              "description": "Value to use as `this` (i.e the reference Object) when executing callback.",
              "lineNumber": 6,
              "type": null,
              "name": "context"
            },
            {
              "title": "example",
              "description": "player.on(VideoPlayer.UI_EVENTS.PLAY_TRIGGERED, () => {\n  // Will be executed after you will click on play button\n});\n\n// To supply a context value for `this` when the callback is invoked,\n// pass the optional context argument\nplayer.on(VideoPlayer.VIDEO_EVENTS.UPLOAD_STALLED, this.handleStalledUpload, this);",
              "lineNumber": 8
            }
          ],
          "loc": {
            "start": {
              "line": 3,
              "column": 2
            },
            "end": {
              "line": 19,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 20,
                "column": 2
              },
              "end": {
                "line": 20,
                "column": 53
              }
            }
          },
          "augments": [],
          "examples": [
            {
              "description": "player.on(VideoPlayer.UI_EVENTS.PLAY_TRIGGERED, () => {\n  // Will be executed after you will click on play button\n});\n\n// To supply a context value for `this` when the callback is invoked,\n// pass the optional context argument\nplayer.on(VideoPlayer.VIDEO_EVENTS.UPLOAD_STALLED, this.handleStalledUpload, this);"
            }
          ],
          "params": [
            {
              "title": "param",
              "name": "event",
              "lineNumber": 4,
              "description": {
                "type": "root",
                "children": [
                  {
                    "type": "paragraph",
                    "children": [
                      {
                        "type": "text",
                        "value": "The Event name, such as ",
                        "position": {
                          "start": {
                            "line": 1,
                            "column": 1,
                            "offset": 0
                          },
                          "end": {
                            "line": 1,
                            "column": 25,
                            "offset": 24
                          },
                          "indent": []
                        }
                      },
                      {
                        "type": "inlineCode",
                        "value": "VideoPlayer.UI_EVENTS.PLAY_TRIGGERED",
                        "position": {
                          "start": {
                            "line": 1,
                            "column": 25,
                            "offset": 24
                          },
                          "end": {
                            "line": 1,
                            "column": 63,
                            "offset": 62
                          },
                          "indent": []
                        }
                      }
                    ],
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 63,
                        "offset": 62
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 63,
                    "offset": 62
                  }
                }
              },
              "type": {
                "type": "NameExpression",
                "name": "string"
              }
            },
            {
              "title": "param",
              "name": "fn",
              "lineNumber": 5,
              "description": {
                "type": "root",
                "children": [
                  {
                    "type": "paragraph",
                    "children": [
                      {
                        "type": "text",
                        "value": "A function callback to execute when the event is triggered.",
                        "position": {
                          "start": {
                            "line": 1,
                            "column": 1,
                            "offset": 0
                          },
                          "end": {
                            "line": 1,
                            "column": 60,
                            "offset": 59
                          },
                          "indent": []
                        }
                      }
                    ],
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 60,
                        "offset": 59
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 60,
                    "offset": 59
                  }
                }
              },
              "type": {
                "type": "NameExpression",
                "name": "ListenerFn"
              }
            },
            {
              "title": "param",
              "name": "context",
              "lineNumber": 6,
              "description": {
                "type": "root",
                "children": [
                  {
                    "type": "paragraph",
                    "children": [
                      {
                        "type": "text",
                        "value": "Value to use as ",
                        "position": {
                          "start": {
                            "line": 1,
                            "column": 1,
                            "offset": 0
                          },
                          "end": {
                            "line": 1,
                            "column": 17,
                            "offset": 16
                          },
                          "indent": []
                        }
                      },
                      {
                        "type": "inlineCode",
                        "value": "this",
                        "position": {
                          "start": {
                            "line": 1,
                            "column": 17,
                            "offset": 16
                          },
                          "end": {
                            "line": 1,
                            "column": 23,
                            "offset": 22
                          },
                          "indent": []
                        }
                      },
                      {
                        "type": "text",
                        "value": " (i.e the reference Object) when executing callback.",
                        "position": {
                          "start": {
                            "line": 1,
                            "column": 23,
                            "offset": 22
                          },
                          "end": {
                            "line": 1,
                            "column": 75,
                            "offset": 74
                          },
                          "indent": []
                        }
                      }
                    ],
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 75,
                        "offset": 74
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 75,
                    "offset": 74
                  }
                }
              },
              "type": {
                "type": "AllLiteral"
              }
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "on",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "on",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#on"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Method for removing listeners of events inside player.",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 55,
                        "offset": 54
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 55,
                    "offset": 54
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 55,
                "offset": 54
              }
            }
          },
          "tags": [
            {
              "title": "param",
              "description": "The Event name, such as `VideoPlayer.UI_EVENTS.PLAY_TRIGGERED`",
              "lineNumber": 3,
              "type": null,
              "name": "event"
            },
            {
              "title": "param",
              "description": "Only remove the listeners that match this function.",
              "lineNumber": 4,
              "type": null,
              "name": "fn"
            },
            {
              "title": "param",
              "description": "Only remove the listeners that have this context.",
              "lineNumber": 5,
              "type": null,
              "name": "context"
            },
            {
              "title": "param",
              "description": "Only remove one-time listeners.",
              "lineNumber": 6,
              "type": null,
              "name": "once"
            },
            {
              "title": "example",
              "description": "const callback = function() {\n  // Code to handle some kind of event\n};\n\n// ... Now callback will be called when some one will pause the video ...\nplayer.on(VideoPlayer.UI_EVENTS.PAUSE_TRIGGERED, callback);\n\n// ... callback will no longer be called.\nplayer.off(VideoPlayer.UI_EVENTS.PAUSE_TRIGGERED, callback);\n\n// ... remove all handlers for event UI_EVENTS.PAUSE_TRIGGERED.\nplayer.off(VideoPlayer.UI_EVENTS.PAUSE_TRIGGERED);",
              "lineNumber": 8
            }
          ],
          "loc": {
            "start": {
              "line": 21,
              "column": 2
            },
            "end": {
              "line": 42,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 45,
                "column": 2
              },
              "end": {
                "line": 45,
                "column": 71
              }
            }
          },
          "augments": [],
          "examples": [
            {
              "description": "const callback = function() {\n  // Code to handle some kind of event\n};\n\n// ... Now callback will be called when some one will pause the video ...\nplayer.on(VideoPlayer.UI_EVENTS.PAUSE_TRIGGERED, callback);\n\n// ... callback will no longer be called.\nplayer.off(VideoPlayer.UI_EVENTS.PAUSE_TRIGGERED, callback);\n\n// ... remove all handlers for event UI_EVENTS.PAUSE_TRIGGERED.\nplayer.off(VideoPlayer.UI_EVENTS.PAUSE_TRIGGERED);"
            }
          ],
          "params": [
            {
              "title": "param",
              "name": "event",
              "lineNumber": 3,
              "description": {
                "type": "root",
                "children": [
                  {
                    "type": "paragraph",
                    "children": [
                      {
                        "type": "text",
                        "value": "The Event name, such as ",
                        "position": {
                          "start": {
                            "line": 1,
                            "column": 1,
                            "offset": 0
                          },
                          "end": {
                            "line": 1,
                            "column": 25,
                            "offset": 24
                          },
                          "indent": []
                        }
                      },
                      {
                        "type": "inlineCode",
                        "value": "VideoPlayer.UI_EVENTS.PLAY_TRIGGERED",
                        "position": {
                          "start": {
                            "line": 1,
                            "column": 25,
                            "offset": 24
                          },
                          "end": {
                            "line": 1,
                            "column": 63,
                            "offset": 62
                          },
                          "indent": []
                        }
                      }
                    ],
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 63,
                        "offset": 62
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 63,
                    "offset": 62
                  }
                }
              },
              "type": {
                "type": "NameExpression",
                "name": "string"
              }
            },
            {
              "title": "param",
              "name": "fn",
              "lineNumber": 4,
              "description": {
                "type": "root",
                "children": [
                  {
                    "type": "paragraph",
                    "children": [
                      {
                        "type": "text",
                        "value": "Only remove the listeners that match this function.",
                        "position": {
                          "start": {
                            "line": 1,
                            "column": 1,
                            "offset": 0
                          },
                          "end": {
                            "line": 1,
                            "column": 52,
                            "offset": 51
                          },
                          "indent": []
                        }
                      }
                    ],
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 52,
                        "offset": 51
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 52,
                    "offset": 51
                  }
                }
              },
              "type": {
                "type": "NameExpression",
                "name": "ListenerFn"
              }
            },
            {
              "title": "param",
              "name": "context",
              "lineNumber": 5,
              "description": {
                "type": "root",
                "children": [
                  {
                    "type": "paragraph",
                    "children": [
                      {
                        "type": "text",
                        "value": "Only remove the listeners that have this context.",
                        "position": {
                          "start": {
                            "line": 1,
                            "column": 1,
                            "offset": 0
                          },
                          "end": {
                            "line": 1,
                            "column": 50,
                            "offset": 49
                          },
                          "indent": []
                        }
                      }
                    ],
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 50,
                        "offset": 49
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 50,
                    "offset": 49
                  }
                }
              },
              "type": {
                "type": "AllLiteral"
              }
            },
            {
              "title": "param",
              "name": "once",
              "lineNumber": 6,
              "description": {
                "type": "root",
                "children": [
                  {
                    "type": "paragraph",
                    "children": [
                      {
                        "type": "text",
                        "value": "Only remove one-time listeners.",
                        "position": {
                          "start": {
                            "line": 1,
                            "column": 1,
                            "offset": 0
                          },
                          "end": {
                            "line": 1,
                            "column": 32,
                            "offset": 31
                          },
                          "indent": []
                        }
                      }
                    ],
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 32,
                        "offset": 31
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 32,
                    "offset": 31
                  }
                }
              },
              "type": {
                "type": "NameExpression",
                "name": "boolean"
              }
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "off",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "off",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#off"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Manual enter full screen",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 25,
                        "offset": 24
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 25,
                    "offset": 24
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 25,
                "offset": 24
              }
            }
          },
          "tags": [],
          "loc": {
            "start": {
              "line": 47,
              "column": 2
            },
            "end": {
              "line": 49,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 50,
                "column": 2
              },
              "end": {
                "line": 50,
                "column": 22
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "enterFullScreen",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "enterFullScreen",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#enterFullScreen"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Manual exit full screen",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 24,
                        "offset": 23
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 24,
                    "offset": 23
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 24,
                "offset": 23
              }
            }
          },
          "tags": [],
          "loc": {
            "start": {
              "line": 51,
              "column": 2
            },
            "end": {
              "line": 53,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 56,
                "column": 2
              },
              "end": {
                "line": 56,
                "column": 21
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "exitFullScreen",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "exitFullScreen",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#exitFullScreen"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Return true if player is in full screen",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 40,
                        "offset": 39
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 40,
                    "offset": 39
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 40,
                "offset": 39
              }
            }
          },
          "tags": [],
          "loc": {
            "start": {
              "line": 57,
              "column": 2
            },
            "end": {
              "line": 59,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 62,
                "column": 2
              },
              "end": {
                "line": 62,
                "column": 34
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [],
          "properties": [],
          "returns": [
            {
              "title": "returns",
              "type": {
                "type": "NameExpression",
                "name": "boolean"
              }
            }
          ],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "isInFullScreen",
          "kind": "member",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "isInFullScreen",
              "kind": "member",
              "scope": "instance"
            }
          ],
          "namespace": "Player#isInFullScreen"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Return object with internal debug info",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 39,
                        "offset": 38
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 39,
                    "offset": 38
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 39,
                "offset": 38
              }
            }
          },
          "tags": [
            {
              "title": "example",
              "description": "{\n  type, // Name of current attached stream (HLS, DASH, MP4, WEBM)\n  viewDimensions: {\n    width,\n    height\n  }, // Current size of view port provided by engine (right now - actual size of video tag)\n  url, // Url of current source\n  currentTime, // Current time of playback\n  duration, // Duration of current video\n  loadingStateTimestamps, // Object with time spend for different initial phases\n  bitrates, // List of all available bitrates. Internal structure different for different type of streams\n  currentBitrate, // Current bitrate. Internal structure different for different type of streams\n  overallBufferLength, // Overall length of buffer\n  nearestBufferSegInfo // Object with start and end for current buffer segment\n}",
              "lineNumber": 3
            }
          ],
          "loc": {
            "start": {
              "line": 64,
              "column": 2
            },
            "end": {
              "line": 83,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 84,
                "column": 2
              },
              "end": {
                "line": 84,
                "column": 30
              }
            }
          },
          "augments": [],
          "examples": [
            {
              "description": "{\n  type, // Name of current attached stream (HLS, DASH, MP4, WEBM)\n  viewDimensions: {\n    width,\n    height\n  }, // Current size of view port provided by engine (right now - actual size of video tag)\n  url, // Url of current source\n  currentTime, // Current time of playback\n  duration, // Duration of current video\n  loadingStateTimestamps, // Object with time spend for different initial phases\n  bitrates, // List of all available bitrates. Internal structure different for different type of streams\n  currentBitrate, // Current bitrate. Internal structure different for different type of streams\n  overallBufferLength, // Overall length of buffer\n  nearestBufferSegInfo // Object with start and end for current buffer segment\n}"
            }
          ],
          "params": [],
          "properties": [],
          "returns": [
            {
              "title": "returns",
              "type": {
                "type": "NameExpression",
                "name": "DebugInfo"
              }
            }
          ],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "getDebugInfo",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "getDebugInfo",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#getDebugInfo"
        },
        {
          "description": "",
          "tags": [],
          "loc": {
            "start": {
              "line": 86,
              "column": 2
            },
            "end": {
              "line": 86,
              "column": 8
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 87,
                "column": 2
              },
              "end": {
                "line": 87,
                "column": 16
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [
            {
              "title": "param",
              "name": "src",
              "lineNumber": 87
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "setSrc",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "setSrc",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#setSrc"
        },
        {
          "description": "",
          "tags": [],
          "loc": {
            "start": {
              "line": 89,
              "column": 2
            },
            "end": {
              "line": 89,
              "column": 8
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 90,
                "column": 2
              },
              "end": {
                "line": 90,
                "column": 13
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "getSrc",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "getSrc",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#getSrc"
        },
        {
          "description": "",
          "tags": [],
          "loc": {
            "start": {
              "line": 92,
              "column": 2
            },
            "end": {
              "line": 92,
              "column": 8
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 93,
                "column": 2
              },
              "end": {
                "line": 93,
                "column": 13
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "goLive",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "goLive",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#goLive"
        },
        {
          "description": "",
          "tags": [],
          "loc": {
            "start": {
              "line": 95,
              "column": 2
            },
            "end": {
              "line": 95,
              "column": 8
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 96,
                "column": 2
              },
              "end": {
                "line": 96,
                "column": 19
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [
            {
              "title": "param",
              "name": "sec",
              "lineNumber": 96
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "goForward",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "goForward",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#goForward"
        },
        {
          "description": "",
          "tags": [],
          "loc": {
            "start": {
              "line": 98,
              "column": 2
            },
            "end": {
              "line": 98,
              "column": 8
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 99,
                "column": 2
              },
              "end": {
                "line": 99,
                "column": 20
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [
            {
              "title": "param",
              "name": "sec",
              "lineNumber": 99
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "goBackward",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "goBackward",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#goBackward"
        },
        {
          "description": "",
          "tags": [],
          "loc": {
            "start": {
              "line": 101,
              "column": 2
            },
            "end": {
              "line": 101,
              "column": 8
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 102,
                "column": 2
              },
              "end": {
                "line": 102,
                "column": 26
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [
            {
              "title": "param",
              "name": "value",
              "lineNumber": 102
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "decreaseVolume",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "decreaseVolume",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#decreaseVolume"
        },
        {
          "description": "",
          "tags": [],
          "loc": {
            "start": {
              "line": 104,
              "column": 2
            },
            "end": {
              "line": 104,
              "column": 8
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 105,
                "column": 2
              },
              "end": {
                "line": 105,
                "column": 26
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [
            {
              "title": "param",
              "name": "value",
              "lineNumber": 105
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "increaseVolume",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "increaseVolume",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#increaseVolume"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Set autoPlay flag",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 18,
                        "offset": 17
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 18,
                    "offset": 17
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 18,
                "offset": 17
              }
            }
          },
          "tags": [],
          "loc": {
            "start": {
              "line": 106,
              "column": 2
            },
            "end": {
              "line": 108,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 111,
                "column": 2
              },
              "end": {
                "line": 111,
                "column": 37
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [
            {
              "title": "param",
              "name": "isAutoPlay",
              "lineNumber": 111,
              "type": {
                "type": "NameExpression",
                "name": "boolean"
              }
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "setAutoPlay",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "setAutoPlay",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#setAutoPlay"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Get autoPlay flag",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 18,
                        "offset": 17
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 18,
                    "offset": 17
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 18,
                "offset": 17
              }
            }
          },
          "tags": [],
          "loc": {
            "start": {
              "line": 112,
              "column": 2
            },
            "end": {
              "line": 114,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 117,
                "column": 2
              },
              "end": {
                "line": 117,
                "column": 27
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [],
          "properties": [],
          "returns": [
            {
              "title": "returns",
              "type": {
                "type": "NameExpression",
                "name": "boolean"
              }
            }
          ],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "getAutoPlay",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "getAutoPlay",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#getAutoPlay"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Set loop flag",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 14,
                        "offset": 13
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 14,
                    "offset": 13
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 14,
                "offset": 13
              }
            }
          },
          "tags": [],
          "loc": {
            "start": {
              "line": 118,
              "column": 2
            },
            "end": {
              "line": 120,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 123,
                "column": 2
              },
              "end": {
                "line": 123,
                "column": 29
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [
            {
              "title": "param",
              "name": "isLoop",
              "lineNumber": 123,
              "type": {
                "type": "NameExpression",
                "name": "boolean"
              }
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "setLoop",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "setLoop",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#setLoop"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Get loop flag",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 14,
                        "offset": 13
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 14,
                    "offset": 13
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 14,
                "offset": 13
              }
            }
          },
          "tags": [],
          "loc": {
            "start": {
              "line": 124,
              "column": 2
            },
            "end": {
              "line": 126,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 129,
                "column": 2
              },
              "end": {
                "line": 129,
                "column": 23
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [],
          "properties": [],
          "returns": [
            {
              "title": "returns",
              "type": {
                "type": "NameExpression",
                "name": "boolean"
              }
            }
          ],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "getLoop",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "getLoop",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#getLoop"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Set mute flag",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 14,
                        "offset": 13
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 14,
                    "offset": 13
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 14,
                "offset": 13
              }
            }
          },
          "tags": [],
          "loc": {
            "start": {
              "line": 130,
              "column": 2
            },
            "end": {
              "line": 132,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 135,
                "column": 2
              },
              "end": {
                "line": 135,
                "column": 30
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [
            {
              "title": "param",
              "name": "isMuted",
              "lineNumber": 135,
              "type": {
                "type": "NameExpression",
                "name": "boolean"
              }
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "setMute",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "setMute",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#setMute"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Get mute flag",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 14,
                        "offset": 13
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 14,
                    "offset": 13
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 14,
                "offset": 13
              }
            }
          },
          "tags": [],
          "loc": {
            "start": {
              "line": 136,
              "column": 2
            },
            "end": {
              "line": 138,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 141,
                "column": 2
              },
              "end": {
                "line": 141,
                "column": 23
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [],
          "properties": [],
          "returns": [
            {
              "title": "returns",
              "type": {
                "type": "NameExpression",
                "name": "boolean"
              }
            }
          ],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "getMute",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "getMute",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#getMute"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Set volume",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 11,
                        "offset": 10
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 11,
                    "offset": 10
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 11,
                "offset": 10
              }
            }
          },
          "tags": [
            {
              "title": "param",
              "description": "Volume value `0..100`",
              "lineNumber": 2,
              "type": null,
              "name": "volume"
            }
          ],
          "loc": {
            "start": {
              "line": 142,
              "column": 2
            },
            "end": {
              "line": 145,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 148,
                "column": 2
              },
              "end": {
                "line": 148,
                "column": 30
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [
            {
              "title": "param",
              "name": "volume",
              "lineNumber": 2,
              "description": {
                "type": "root",
                "children": [
                  {
                    "type": "paragraph",
                    "children": [
                      {
                        "type": "text",
                        "value": "Volume value ",
                        "position": {
                          "start": {
                            "line": 1,
                            "column": 1,
                            "offset": 0
                          },
                          "end": {
                            "line": 1,
                            "column": 14,
                            "offset": 13
                          },
                          "indent": []
                        }
                      },
                      {
                        "type": "inlineCode",
                        "value": "0..100",
                        "position": {
                          "start": {
                            "line": 1,
                            "column": 14,
                            "offset": 13
                          },
                          "end": {
                            "line": 1,
                            "column": 22,
                            "offset": 21
                          },
                          "indent": []
                        }
                      }
                    ],
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 22,
                        "offset": 21
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 22,
                    "offset": 21
                  }
                }
              },
              "type": {
                "type": "NameExpression",
                "name": "number"
              }
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "setVolume",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "setVolume",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#setVolume"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Get volume",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 11,
                        "offset": 10
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 11,
                    "offset": 10
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 11,
                "offset": 10
              }
            }
          },
          "tags": [],
          "loc": {
            "start": {
              "line": 149,
              "column": 2
            },
            "end": {
              "line": 151,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 154,
                "column": 2
              },
              "end": {
                "line": 154,
                "column": 24
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [],
          "properties": [],
          "returns": [
            {
              "title": "returns",
              "type": {
                "type": "NameExpression",
                "name": "number"
              }
            }
          ],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "getVolume",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "getVolume",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#getVolume"
        },
        {
          "description": "",
          "tags": [],
          "loc": {
            "start": {
              "line": 156,
              "column": 2
            },
            "end": {
              "line": 156,
              "column": 8
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 157,
                "column": 2
              },
              "end": {
                "line": 157,
                "column": 26
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [
            {
              "title": "param",
              "name": "rate",
              "lineNumber": 157
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "setPlaybackRate",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "setPlaybackRate",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#setPlaybackRate"
        },
        {
          "description": "",
          "tags": [],
          "loc": {
            "start": {
              "line": 159,
              "column": 2
            },
            "end": {
              "line": 159,
              "column": 8
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 160,
                "column": 2
              },
              "end": {
                "line": 160,
                "column": 22
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "getPlaybackRate",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "getPlaybackRate",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#getPlaybackRate"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Set preload type",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 17,
                        "offset": 16
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 17,
                    "offset": 16
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 17,
                "offset": 16
              }
            }
          },
          "tags": [],
          "loc": {
            "start": {
              "line": 161,
              "column": 2
            },
            "end": {
              "line": 163,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 166,
                "column": 2
              },
              "end": {
                "line": 166,
                "column": 54
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [
            {
              "title": "param",
              "name": "preload",
              "lineNumber": 166,
              "type": {
                "type": "UnionType",
                "elements": [
                  {
                    "type": "StringLiteralType",
                    "value": "auto"
                  },
                  {
                    "type": "StringLiteralType",
                    "value": "metadata"
                  },
                  {
                    "type": "StringLiteralType",
                    "value": "none"
                  }
                ]
              }
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "setPreload",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "setPreload",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#setPreload"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Get preload type",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 17,
                        "offset": 16
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 17,
                    "offset": 16
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 17,
                "offset": 16
              }
            }
          },
          "tags": [],
          "loc": {
            "start": {
              "line": 167,
              "column": 2
            },
            "end": {
              "line": 169,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 172,
                "column": 2
              },
              "end": {
                "line": 172,
                "column": 25
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [],
          "properties": [],
          "returns": [
            {
              "title": "returns",
              "type": {
                "type": "NameExpression",
                "name": "string"
              }
            }
          ],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "getPreload",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "getPreload",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#getPreload"
        },
        {
          "description": "",
          "tags": [],
          "loc": {
            "start": {
              "line": 174,
              "column": 2
            },
            "end": {
              "line": 174,
              "column": 8
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 175,
                "column": 2
              },
              "end": {
                "line": 175,
                "column": 21
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "getCurrentTime",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "getCurrentTime",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#getCurrentTime"
        },
        {
          "description": "",
          "tags": [],
          "loc": {
            "start": {
              "line": 177,
              "column": 2
            },
            "end": {
              "line": 177,
              "column": 8
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 178,
                "column": 2
              },
              "end": {
                "line": 178,
                "column": 15
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [
            {
              "title": "param",
              "name": "time",
              "lineNumber": 178
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "goTo",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "goTo",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#goTo"
        },
        {
          "description": "",
          "tags": [],
          "loc": {
            "start": {
              "line": 180,
              "column": 2
            },
            "end": {
              "line": 180,
              "column": 8
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 181,
                "column": 2
              },
              "end": {
                "line": 181,
                "column": 22
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "getDurationTime",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "getDurationTime",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#getDurationTime"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Set playInline flag",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 20,
                        "offset": 19
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 20,
                    "offset": 19
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 20,
                "offset": 19
              }
            }
          },
          "tags": [],
          "loc": {
            "start": {
              "line": 183,
              "column": 2
            },
            "end": {
              "line": 185,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 186,
                "column": 2
              },
              "end": {
                "line": 186,
                "column": 41
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [
            {
              "title": "param",
              "name": "isPlayInline",
              "lineNumber": 186,
              "type": {
                "type": "NameExpression",
                "name": "boolean"
              }
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "setPlayInline",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "setPlayInline",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#setPlayInline"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Get playInline flag",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 20,
                        "offset": 19
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 20,
                    "offset": 19
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 20,
                "offset": 19
              }
            }
          },
          "tags": [],
          "loc": {
            "start": {
              "line": 187,
              "column": 2
            },
            "end": {
              "line": 189,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 192,
                "column": 2
              },
              "end": {
                "line": 192,
                "column": 29
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [],
          "properties": [],
          "returns": [
            {
              "title": "returns",
              "type": {
                "type": "NameExpression",
                "name": "boolean"
              }
            }
          ],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "getPlayInline",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "getPlayInline",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#getPlayInline"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Return current state of playback",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 33,
                        "offset": 32
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 33,
                    "offset": 32
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 33,
                "offset": 32
              }
            }
          },
          "tags": [],
          "loc": {
            "start": {
              "line": 193,
              "column": 2
            },
            "end": {
              "line": 195,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 198,
                "column": 2
              },
              "end": {
                "line": 198,
                "column": 30
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "getCurrentPlaybackState",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "getCurrentPlaybackState",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#getCurrentPlaybackState"
        },
        {
          "description": "",
          "tags": [],
          "loc": {
            "start": {
              "line": 200,
              "column": 2
            },
            "end": {
              "line": 200,
              "column": 8
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 201,
                "column": 2
              },
              "end": {
                "line": 201,
                "column": 11
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "play",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "play",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#play"
        },
        {
          "description": "",
          "tags": [],
          "loc": {
            "start": {
              "line": 203,
              "column": 2
            },
            "end": {
              "line": 203,
              "column": 8
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 204,
                "column": 2
              },
              "end": {
                "line": 204,
                "column": 12
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "pause",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "pause",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#pause"
        },
        {
          "description": "",
          "tags": [],
          "loc": {
            "start": {
              "line": 206,
              "column": 2
            },
            "end": {
              "line": 206,
              "column": 8
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 207,
                "column": 2
              },
              "end": {
                "line": 207,
                "column": 21
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "togglePlayback",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "togglePlayback",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#togglePlayback"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Getter for DOM node with player UI element\n(use it only for debug, if you need attach player to your document use ",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 2,
                        "column": 72,
                        "offset": 114
                      },
                      "indent": [
                        1
                      ]
                    }
                  },
                  {
                    "type": "inlineCode",
                    "value": "attachToElement",
                    "position": {
                      "start": {
                        "line": 2,
                        "column": 72,
                        "offset": 114
                      },
                      "end": {
                        "line": 2,
                        "column": 89,
                        "offset": 131
                      },
                      "indent": []
                    }
                  },
                  {
                    "type": "text",
                    "value": " method)",
                    "position": {
                      "start": {
                        "line": 2,
                        "column": 89,
                        "offset": 131
                      },
                      "end": {
                        "line": 2,
                        "column": 97,
                        "offset": 139
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 2,
                    "column": 97,
                    "offset": 139
                  },
                  "indent": [
                    1
                  ]
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 2,
                "column": 97,
                "offset": 139
              }
            }
          },
          "tags": [],
          "loc": {
            "start": {
              "line": 209,
              "column": 2
            },
            "end": {
              "line": 212,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 213,
                "column": 2
              },
              "end": {
                "line": 213,
                "column": 21
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [],
          "properties": [],
          "returns": [
            {
              "title": "returns",
              "type": {
                "type": "NameExpression",
                "name": "Node"
              }
            }
          ],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "node",
          "kind": "member",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "node",
              "kind": "member",
              "scope": "instance"
            }
          ],
          "namespace": "Player#node"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Method for attaching player node to your container",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 51,
                        "offset": 50
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 51,
                    "offset": 50
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 51,
                "offset": 50
              }
            }
          },
          "tags": [
            {
              "title": "example",
              "description": "document.addEventListener('DOMContentLoaded', function() {\n  const config = { src: 'http://my-url/video.mp4' }\n  const player = VideoPlayer.create(config);\n\n  player.attachToElement(document.getElementById('content'));\n});",
              "lineNumber": 3
            }
          ],
          "loc": {
            "start": {
              "line": 215,
              "column": 2
            },
            "end": {
              "line": 225,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 226,
                "column": 2
              },
              "end": {
                "line": 226,
                "column": 32
              }
            }
          },
          "augments": [],
          "examples": [
            {
              "description": "document.addEventListener('DOMContentLoaded', function() {\n  const config = { src: 'http://my-url/video.mp4' }\n  const player = VideoPlayer.create(config);\n\n  player.attachToElement(document.getElementById('content'));\n});"
            }
          ],
          "params": [
            {
              "title": "param",
              "name": "node",
              "lineNumber": 226,
              "type": {
                "type": "NameExpression",
                "name": "Node"
              }
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "attachToElement",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "attachToElement",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#attachToElement"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Hide whole ui",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 14,
                        "offset": 13
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 14,
                    "offset": 13
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 14,
                "offset": 13
              }
            }
          },
          "tags": [],
          "loc": {
            "start": {
              "line": 227,
              "column": 2
            },
            "end": {
              "line": 229,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 232,
                "column": 2
              },
              "end": {
                "line": 232,
                "column": 11
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "hide",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "hide",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#hide"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Show whole ui",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 14,
                        "offset": 13
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 14,
                    "offset": 13
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 14,
                "offset": 13
              }
            }
          },
          "tags": [],
          "loc": {
            "start": {
              "line": 233,
              "column": 2
            },
            "end": {
              "line": 235,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 238,
                "column": 2
              },
              "end": {
                "line": 238,
                "column": 11
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "show",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "show",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#show"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Set width of player",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 20,
                        "offset": 19
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 20,
                    "offset": 19
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 20,
                "offset": 19
              }
            }
          },
          "tags": [],
          "loc": {
            "start": {
              "line": 239,
              "column": 2
            },
            "end": {
              "line": 241,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 244,
                "column": 2
              },
              "end": {
                "line": 244,
                "column": 28
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [
            {
              "title": "param",
              "name": "width",
              "lineNumber": 244,
              "type": {
                "type": "NameExpression",
                "name": "number"
              }
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "setWidth",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "setWidth",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#setWidth"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Set height of player",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 21,
                        "offset": 20
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 21,
                    "offset": 20
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 21,
                "offset": 20
              }
            }
          },
          "tags": [],
          "loc": {
            "start": {
              "line": 245,
              "column": 2
            },
            "end": {
              "line": 247,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 250,
                "column": 2
              },
              "end": {
                "line": 250,
                "column": 30
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [
            {
              "title": "param",
              "name": "height",
              "lineNumber": 250,
              "type": {
                "type": "NameExpression",
                "name": "number"
              }
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "setHeight",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "setHeight",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#setHeight"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Get width of player",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 20,
                        "offset": 19
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 20,
                    "offset": 19
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 20,
                "offset": 19
              }
            }
          },
          "tags": [],
          "loc": {
            "start": {
              "line": 251,
              "column": 2
            },
            "end": {
              "line": 253,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 256,
                "column": 2
              },
              "end": {
                "line": 256,
                "column": 23
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [],
          "properties": [],
          "returns": [
            {
              "title": "returns",
              "type": {
                "type": "NameExpression",
                "name": "number"
              }
            }
          ],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "getWidth",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "getWidth",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#getWidth"
        },
        {
          "description": {
            "type": "root",
            "children": [
              {
                "type": "paragraph",
                "children": [
                  {
                    "type": "text",
                    "value": "Get height of player",
                    "position": {
                      "start": {
                        "line": 1,
                        "column": 1,
                        "offset": 0
                      },
                      "end": {
                        "line": 1,
                        "column": 21,
                        "offset": 20
                      },
                      "indent": []
                    }
                  }
                ],
                "position": {
                  "start": {
                    "line": 1,
                    "column": 1,
                    "offset": 0
                  },
                  "end": {
                    "line": 1,
                    "column": 21,
                    "offset": 20
                  },
                  "indent": []
                }
              }
            ],
            "position": {
              "start": {
                "line": 1,
                "column": 1,
                "offset": 0
              },
              "end": {
                "line": 1,
                "column": 21,
                "offset": 20
              }
            }
          },
          "tags": [],
          "loc": {
            "start": {
              "line": 257,
              "column": 2
            },
            "end": {
              "line": 259,
              "column": 5
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 262,
                "column": 2
              },
              "end": {
                "line": 262,
                "column": 24
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [],
          "properties": [],
          "returns": [
            {
              "title": "returns",
              "type": {
                "type": "NameExpression",
                "name": "number"
              }
            }
          ],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "getHeight",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "getHeight",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#getHeight"
        },
        {
          "description": "",
          "tags": [],
          "loc": {
            "start": {
              "line": 264,
              "column": 2
            },
            "end": {
              "line": 264,
              "column": 8
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 265,
                "column": 2
              },
              "end": {
                "line": 265,
                "column": 26
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [
            {
              "title": "param",
              "name": "flag",
              "lineNumber": 265
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "setFillAllSpace",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "setFillAllSpace",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#setFillAllSpace"
        },
        {
          "description": "",
          "tags": [],
          "loc": {
            "start": {
              "line": 267,
              "column": 2
            },
            "end": {
              "line": 267,
              "column": 8
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 268,
                "column": 2
              },
              "end": {
                "line": 268,
                "column": 18
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [
            {
              "title": "param",
              "name": "logo",
              "lineNumber": 268
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "setLogo",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "setLogo",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#setLogo"
        },
        {
          "description": "",
          "tags": [],
          "loc": {
            "start": {
              "line": 270,
              "column": 2
            },
            "end": {
              "line": 270,
              "column": 8
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 271,
                "column": 2
              },
              "end": {
                "line": 271,
                "column": 40
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [
            {
              "title": "param",
              "name": "isShowAlways",
              "lineNumber": 271
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "setLogoAlwaysShowFlag",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "setLogoAlwaysShowFlag",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#setLogoAlwaysShowFlag"
        },
        {
          "description": "",
          "tags": [],
          "loc": {
            "start": {
              "line": 273,
              "column": 2
            },
            "end": {
              "line": 273,
              "column": 8
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 274,
                "column": 2
              },
              "end": {
                "line": 274,
                "column": 35
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [
            {
              "title": "param",
              "name": "callback",
              "lineNumber": 274
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "setLogoClickCallback",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "setLogoClickCallback",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#setLogoClickCallback"
        },
        {
          "description": "",
          "tags": [],
          "loc": {
            "start": {
              "line": 276,
              "column": 2
            },
            "end": {
              "line": 276,
              "column": 8
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 277,
                "column": 2
              },
              "end": {
                "line": 277,
                "column": 17
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "removeLogo",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "removeLogo",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#removeLogo"
        },
        {
          "description": "",
          "tags": [],
          "loc": {
            "start": {
              "line": 279,
              "column": 2
            },
            "end": {
              "line": 279,
              "column": 8
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 280,
                "column": 2
              },
              "end": {
                "line": 280,
                "column": 38
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [
            {
              "title": "param",
              "name": "flag",
              "lineNumber": 280
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "setControlsShouldAlwaysShow",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "setControlsShouldAlwaysShow",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#setControlsShouldAlwaysShow"
        },
        {
          "description": "",
          "tags": [],
          "loc": {
            "start": {
              "line": 282,
              "column": 2
            },
            "end": {
              "line": 282,
              "column": 8
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 283,
                "column": 2
              },
              "end": {
                "line": 283,
                "column": 25
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [
            {
              "title": "param",
              "name": "url",
              "lineNumber": 283
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "setLoadingCover",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "setLoadingCover",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#setLoadingCover"
        },
        {
          "description": "",
          "tags": [],
          "loc": {
            "start": {
              "line": 285,
              "column": 2
            },
            "end": {
              "line": 285,
              "column": 8
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 286,
                "column": 2
              },
              "end": {
                "line": 286,
                "column": 29
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [
            {
              "title": "param",
              "name": "title",
              "lineNumber": 286,
              "type": {
                "type": "NameExpression",
                "name": "string"
              }
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "setTitle",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "setTitle",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#setTitle"
        },
        {
          "description": "",
          "tags": [],
          "loc": {
            "start": {
              "line": 288,
              "column": 2
            },
            "end": {
              "line": 288,
              "column": 8
            }
          },
          "context": {
            "loc": {
              "start": {
                "line": 289,
                "column": 2
              },
              "end": {
                "line": 289,
                "column": 47
              }
            }
          },
          "augments": [],
          "examples": [],
          "params": [
            {
              "title": "param",
              "name": "callback",
              "lineNumber": 289,
              "type": {
                "type": "NameExpression",
                "name": "Function"
              }
            }
          ],
          "properties": [],
          "returns": [],
          "sees": [],
          "throws": [],
          "todos": [],
          "name": "setTitleClickCallback",
          "kind": "function",
          "memberof": "Player",
          "scope": "instance",
          "members": {
            "global": [],
            "inner": [],
            "instance": [],
            "events": [],
            "static": []
          },
          "path": [
            {
              "name": "Player",
              "kind": "class"
            },
            {
              "name": "setTitleClickCallback",
              "kind": "function",
              "scope": "instance"
            }
          ],
          "namespace": "Player#setTitleClickCallback"
        }
      ],
      "events": [],
      "static": []
    },
    "path": [
      {
        "name": "Player",
        "kind": "class"
      }
    ],
    "namespace": "Player"
  }
]