{
  "variables": {
    "openssl_fips": "",
  },
  "targets": [
    {
      "target_name": "desktopIdle",
      "sources": [
        "src/desktop_idle.cc",
      ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"  # Include the nan package
      ],
      "cflags_cc!": [],
      "cflags_cc": [
        "-std=c++20"
      ],
      "xcode_settings": {
        "CLANG_CXX_LANGUAGE_STANDARD": "c++20",
        "CLANG_CXX_LIBRARY": "libc++"
      },
      "conditions": [
        [
          'OS=="mac"',
          {
            "sources": [
              "src/mac/idle.mm"
            ],
            "xcode_settings": {
              "OTHER_LDFLAGS": ["-framework CoreGraphics"]
            }
          }
        ],
        [
          'OS=="linux"',
          {
            "sources": [
              "src/linux/idle.cc"
            ],
            "variables": {
              "pkg-config": "pkg-config"
            },
            "direct_dependent_settings": {
              "cflags": [
                "<!@(<(pkg-config) --cflags libinput libudev)"
              ]
            },
            "link_settings": {
              "ldflags": [
                "<!@(<(pkg-config) --libs-only-other --libs-only-L libinput libudev)"
              ],
              "libraries": [
                "<!@(<(pkg-config) --libs-only-l libinput libudev)"
              ]
            }
          }
        ],
        [
          'OS=="freebsd"',
          {
            "sources": [
              "src/linux/idle.cc"
            ],
            "variables": {
              "pkg-config": "pkg-config"
            },
            "include_dirs": [
              "/usr/local/include"
            ],
            "direct_dependent_settings": {
              "cflags": [
                "<!@(<(pkg-config) --cflags libinput libudev)"
              ]
            },
            "link_settings": {
              "ldflags": [
                "<!@(<(pkg-config) --libs-only-other --libs-only-L libinput libudev)"
              ],
              "libraries": [
                "<!@(<(pkg-config) --libs-only-l libinput libudev)"
              ]
            }
          }
        ],
        [
          'OS=="openbsd"',
          {
            "sources": [
              "src/linux/idle.cc"
            ],
            "variables": {
              "pkg-config": "pkg-config"
            },
            "include_dirs": [
              "/usr/X11R6/include"
            ],
            "direct_dependent_settings": {
              "cflags": [
                "<!@(<(pkg-config) --cflags libinput libudev)"
              ]
            },
            "link_settings": {
              "ldflags": [
                "<!@(<(pkg-config) --libs-only-other --libs-only-L libinput libudev)"
              ],
              "libraries": [
                "<!@(<(pkg-config) --libs-only-l libinput libudev)"
              ]
            }
          }
        ],
        [
          'OS=="win"',
          {
            "sources": [
              "src/win/idle.cc"
            ],
            "msvs_settings": {
              "VCLinkerTool": {
                "AdditionalOptions": ["/ignore:4199"] # Suppress linker warnings
              }
            }
          }
        ]
      ]
    }
  ]
}