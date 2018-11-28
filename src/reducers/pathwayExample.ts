import { handleActions } from 'redux-actions';
import { RootState } from './state';
import { IPathwayExample } from '../models';

const initialState: RootState.PathwayExample = [
  {
    name: 'command1',
    path: "repeat 50 [repeat 159 [tr 44 fd 61] tr 591]",
    command: {
      id: 0,
      name: "repeat",
      value: 50,
      commands: [
        {
          id: 1,
          name: "repeat",
          value: 159,
          commands: [
            { id: 2, name: "tr", value: 44 },
            { id: 3, name: "fd", value: 61 }
          ]
        },
        {
          id: 4,
          name: "tr",
          value: 591
        }
      ]
    },
    image: "command1.jpg",
    type: "simple"
  },
  {
    name: 'command2',
    path: "repeat 150 [fd 105 repeat 19 [bk 90 repeat 10 [tr 15 tl 18 bk 25 tr 65]] tr 13]",
    command: {
      "id": 0,
      "name": "repeat",
      "value": 150,
      "commands": [
         {
            "id": 1,
            "name": "fd",
            "value": 105
         },
         {
            "id": 2,
            "name": "repeat",
            "value": 19,
            "commands": [
               {
                  "id": 3,
                  "name": "bk",
                  "value": 90
               },
               {
                  "id": 4,
                  "name": "repeat",
                  "value": 10,
                  "commands": [
                     {
                        "id": 5,
                        "name": "tr",
                        "value": 15
                     },
                     {
                        "id": 6,
                        "name": "tl",
                        "value": 18
                     },
                     {
                        "id": 7,
                        "name": "bk",
                        "value": 25
                     },
                     {
                        "id": 8,
                        "name": "tr",
                        "value": 65
                     }
                  ]
               }
            ]
         },
         {
            "id": 4,
            "name": "tr",
            "value": 13
         }
      ]
   },
    image: "cnormal2.jpg",
    type: "simple"
  },
  {
    name: 'command3',    
    path: "repeat 100 [repeat 100 [tr 18 fd 45] tr 219]",
    command: {
      "id": 0,
      "name": "repeat",
      "value": 100,
      "commands": [
         {
            "id": 1,
            "name": "repeat",
            "value": 100,
            "commands": [
               {
                  "id": 2,
                  "name": "tr",
                  "value": 18
               },
               {
                  "id": 3,
                  "name": "fd",
                  "value": 45
               }
            ]
         },
         {
            "id": 4,
            "name": "tr",
            "value": 219
         }
      ]
   },
    image: "cnormal3.jpg",
    type: "simple"
  },
  {
    name: 'command4',
    path: "repeat 34 [repeat 72 [tr 103 fd 140 tl 19] tr 239 fd 22 tr 26 bk 9]",
    command: {
      "id": 0,
      "name": "repeat",
      "value": 34,
      "commands": [
         {
            "id": 1,
            "name": "repeat",
            "value": 72,
            "commands": [
               {
                  "id": 2,
                  "name": "tr",
                  "value": 103
               },
               {
                  "id": 3,
                  "name": "fd",
                  "value": 140
               },
               {
                  "id": 4,
                  "name": "tl",
                  "value": 19
               }
            ]
         },
         {
            "id": 5,
            "name": "tr",
            "value": 239
         },
         {
            "id": 6,
            "name": "fd",
            "value": 22
         },
         {
            "id": 7,
            "name": "tr",
            "value": 26
         },
         {
            "id": 8,
            "name": "bk",
            "value": 9
         }
      ]
   },
    image: "cnormal4.jpg",
    type: "simple"
  },
  {
    name: 'command5',    
    path: "repeat 28 [repeat 72 [tr 123 fd 141 tl 19] tr 239 fd 16 tr 52 bk 47]",
    command: {
      "id": 8,
      "name": "repeat",
      "value": 28,
      "commands": [
         {
            "id": 9,
            "name": "repeat",
            "value": 72,
            "commands": [
               {
                  "id": 10,
                  "name": "tr",
                  "value": 123
               },
               {
                  "id": 11,
                  "name": "fd",
                  "value": 141
               },
               {
                  "id": 12,
                  "name": "tl",
                  "value": 19
               }
            ]
         },
         {
            "id": 11,
            "name": "tr",
            "value": 239
         },
         {
            "id": 12,
            "name": "fd",
            "value": 16
         },
         {
            "id": 13,
            "name": "tr",
            "value": 52
         },
         {
            "id": 14,
            "name": "bk",
            "value": 47
         }
      ]
   },
    image: "cnormal5.jpg",
    type: "simple"
  }, 
  {
    name: 'command6',
    path: "repeat 32 [repeat 94 [tr 103 fd 140 tl 19] tr 239 fd 22 tr 9 bk 9]",
    command: {
      "id": 0,
      "name": "repeat",
      "value": 32,
      "commands": [
         {
            "id": 1,
            "name": "repeat",
            "value": 94,
            "commands": [
               {
                  "id": 2,
                  "name": "tr",
                  "value": 103
               },
               {
                  "id": 3,
                  "name": "fd",
                  "value": 140
               },
               {
                  "id": 4,
                  "name": "tl",
                  "value": 19
               }
            ]
         },
         {
            "id": 3,
            "name": "tr",
            "value": 239
         },
         {
            "id": 4,
            "name": "fd",
            "value": 22
         },
         {
            "id": 5,
            "name": "tr",
            "value": 9
         },
         {
            "id": 6,
            "name": "bk",
            "value": 9
         }
      ]
   },
    image: "cnormal6.jpg",
    type: "simple"
  },
  {
    name: 'command7',    
    path: "repeat 50 [repeat 167 [tr 54 fd 61] tr 591]",
    command: {
      "id": 3,
      "name": "repeat",
      "value": 50,
      "commands": [
         {
            "id": 4,
            "name": "repeat",
            "value": 167,
            "commands": [
               {
                  "id": 5,
                  "name": "tr",
                  "value": 54
               },
               {
                  "id": 6,
                  "name": "fd",
                  "value": 61
               }
            ]
         },
         {
            "id": 6,
            "name": "tr",
            "value": 591
         }
      ]
   },
    image: "cnormal7.jpg",
    type: "simple"
  }, 
  {
    name: 'command8',
    path: "repeat 100 [repeat 102 [tr 103 fd 113] tr 239]",
    command: {
      "id": 0,
      "name": "repeat",
      "value": 100,
      "commands": [
         {
            "id": 1,
            "name": "repeat",
            "value": 102,
            "commands": [
               {
                  "id": 2,
                  "name": "tr",
                  "value": 103
               },
               {
                  "id": 3,
                  "name": "fd",
                  "value": 113
               }
            ]
         },
         {
            "id": 3,
            "name": "tr",
            "value": 239
         }
      ]
   },
    image: "cnormal8.jpg",
    type: "simple"
  },
  {
    name: 'command9',    
    path: "repeat 150 [fd 105 repeat 19 [bk 90 repeat 10 [tr 15 tl 18 bk 25 tr 65]] tr 16]",
    command: {
      "id": 0,
      "name": "repeat",
      "value": 150,
      "commands": [
         {
            "id": 1,
            "name": "fd",
            "value": 105
         },
         {
            "id": 2,
            "name": "repeat",
            "value": 19,
            "commands": [
               {
                  "id": 3,
                  "name": "bk",
                  "value": 90
               },
               {
                  "id": 4,
                  "name": "repeat",
                  "value": 10,
                  "commands": [
                     {
                        "id": 5,
                        "name": "tr",
                        "value": 15
                     },
                     {
                        "id": 6,
                        "name": "tl",
                        "value": 18
                     },
                     {
                        "id": 7,
                        "name": "bk",
                        "value": 25
                     },
                     {
                        "id": 8,
                        "name": "tr",
                        "value": 65
                     }
                  ]
               }
            ]
         },
         {
            "id": 4,
            "name": "tr",
            "value": 16
         }
      ]
   },
    image: "cnormal9.jpg",
    type: "simple"
  },
  {
    name: 'command10',    
    path: "repeat 79 [repeat 102 [tr 103 fd 243 tl 19] tr 239 fd 22 tr 9 bk 9]",
    command: {
      "id": 0,
      "name": "repeat",
      "value": 79,
      "commands": [
         {
            "id": 1,
            "name": "repeat",
            "value": 102,
            "commands": [
               {
                  "id": 2,
                  "name": "tr",
                  "value": 103
               },
               {
                  "id": 3,
                  "name": "fd",
                  "value": 243
               },
               {
                  "id": 4,
                  "name": "tl",
                  "value": 19
               }
            ]
         },
         {
            "id": 3,
            "name": "tr",
            "value": 239
         },
         {
            "id": 4,
            "name": "fd",
            "value": 22
         },
         {
            "id": 5,
            "name": "tr",
            "value": 9
         },
         {
            "id": 6,
            "name": "bk",
            "value": 9
         }
      ]
   },
    image: "cnormal10.jpg",
    type: "simple"
  }, 
  {
    name: 'command11',
    path: "repeat 100 [repeat 100 [tr 18 fd 38] tr 239]",
    command: {
      "id": 0,
      "name": "repeat",
      "value": 100,
      "commands": [
         {
            "id": 1,
            "name": "repeat",
            "value": 100,
            "commands": [
               {
                  "id": 2,
                  "name": "tr",
                  "value": 18
               },
               {
                  "id": 3,
                  "name": "fd",
                  "value": 38
               }
            ]
         },
         {
            "id": 3,
            "name": "tr",
            "value": 239
         }
      ]
   },
    image: "cnormal11.jpg",
    type: "simple"
  },
  {
    name: 'command12',    
    path: "repeat 89 [repeat 167 [tr 90 fd 200] tr 68]",
    command: {
      "id": 0,
      "name": "repeat",
      "value": 89,
      "commands": [
         {
            "id": 1,
            "name": "repeat",
            "value": 167,
            "commands": [
               {
                  "id": 2,
                  "name": "tr",
                  "value": 90
               },
               {
                  "id": 3,
                  "name": "fd",
                  "value": 200
               }
            ]
         },
         {
            "id": 3,
            "name": "tr",
            "value": 68
         }
      ]
   },
    image: "cnormal12.jpg",
    type: "simple"
  },
  {
    name: 'command1',
    path: "repeat 150 [fd 99 repeat 19 [bk 90 repeat 10 [tr 15 tl 18 bk 3 tr 62]] tr 16]",
    command: {
      "id": 0,
      "name": "repeat",
      "value": 150,
      "commands": [
         {
            "id": 1,
            "name": "fd",
            "value": 99
         },
         {
            "id": 2,
            "name": "repeat",
            "value": 19,
            "commands": [
               {
                  "id": 3,
                  "name": "bk",
                  "value": 90
               },
               {
                  "id": 4,
                  "name": "repeat",
                  "value": 10,
                  "commands": [
                     {
                        "id": 5,
                        "name": "tr",
                        "value": 15
                     },
                     {
                        "id": 6,
                        "name": "tl",
                        "value": 18
                     },
                     {
                        "id": 7,
                        "name": "bk",
                        "value": 3
                     },
                     {
                        "id": 8,
                        "name": "tr",
                        "value": 62
                     }
                  ]
               }
            ]
         },
         {
            "id": 4,
            "name": "tr",
            "value": 16
         }
      ]
   },
    image: "ccrazy1.jpg",
    type: "crazy"
  },
  {
    name: 'command2',
    path: "repeat 60 [fd 100 repeat 10 [bk 17 repeat 10 [tr 15 fd 1 tl 20 bk 18 tr 12]] tr 10 fd 20]",
    command: {
      "id": 0,
      "name": "repeat",
      "value": 60,
      "commands": [
         {
            "id": 1,
            "name": "fd",
            "value": 100
         },
         {
            "id": 2,
            "name": "repeat",
            "value": 10,
            "commands": [
               {
                  "id": 3,
                  "name": "bk",
                  "value": 17
               },
               {
                  "id": 4,
                  "name": "repeat",
                  "value": 10,
                  "commands": [
                     {
                        "id": 5,
                        "name": "tr",
                        "value": 15
                     },
                     {
                        "id": 6,
                        "name": "fd",
                        "value": 1
                     },
                     {
                        "id": 7,
                        "name": "tl",
                        "value": 20
                     },
                     {
                        "id": 8,
                        "name": "bk",
                        "value": 18
                     },
                     {
                        "id": 9,
                        "name": "tr",
                        "value": 12
                     }
                  ]
               }
            ]
         },
         {
            "id": 4,
            "name": "tr",
            "value": 10
         },
         {
            "id": 5,
            "name": "fd",
            "value": 20
         }
      ]
   },
    image: "ccrazy2.jpg",
    type: "crazy"
  },
  {
    name: 'command3',
    path: "repeat 60 [fd 102 repeat 1 [bk 17 repeat 10 [tr 15 fd 1 tl 20 bk 18 tr 12]] tr 10 fd 20]",
    command: {
      "id": 0,
      "name": "repeat",
      "value": 60,
      "commands": [
         {
            "id": 1,
            "name": "fd",
            "value": 102
         },
         {
            "id": 2,
            "name": "repeat",
            "value": 1,
            "commands": [
               {
                  "id": 3,
                  "name": "bk",
                  "value": 17
               },
               {
                  "id": 4,
                  "name": "repeat",
                  "value": 10,
                  "commands": [
                     {
                        "id": 5,
                        "name": "tr",
                        "value": 15
                     },
                     {
                        "id": 6,
                        "name": "fd",
                        "value": 1
                     },
                     {
                        "id": 7,
                        "name": "tl",
                        "value": 20
                     },
                     {
                        "id": 8,
                        "name": "bk",
                        "value": 18
                     },
                     {
                        "id": 9,
                        "name": "tr",
                        "value": 12
                     }
                  ]
               }
            ]
         },
         {
            "id": 4,
            "name": "tr",
            "value": 10
         },
         {
            "id": 5,
            "name": "fd",
            "value": 20
         }
      ]
   },
    image: "ccrazy3.jpg",
    type: "crazy"
  },
  {
    name: 'command4',
    path: "repeat 60 [fd 102 repeat 1 [bk 17 repeat 10 [tr 15 fd 1 tl 20 bk 18 tr 12]] tr 25 fd 22]",
    command: {
      "id": 0,
      "name": "repeat",
      "value": 60,
      "commands": [
         {
            "id": 1,
            "name": "fd",
            "value": 102
         },
         {
            "id": 2,
            "name": "repeat",
            "value": 1,
            "commands": [
               {
                  "id": 3,
                  "name": "bk",
                  "value": 17
               },
               {
                  "id": 4,
                  "name": "repeat",
                  "value": 10,
                  "commands": [
                     {
                        "id": 5,
                        "name": "tr",
                        "value": 15
                     },
                     {
                        "id": 6,
                        "name": "fd",
                        "value": 1
                     },
                     {
                        "id": 7,
                        "name": "tl",
                        "value": 20
                     },
                     {
                        "id": 8,
                        "name": "bk",
                        "value": 18
                     },
                     {
                        "id": 9,
                        "name": "tr",
                        "value": 12
                     }
                  ]
               }
            ]
         },
         {
            "id": 4,
            "name": "tr",
            "value": 25
         },
         {
            "id": 5,
            "name": "fd",
            "value": 22
         }
      ]
   },
    image: "ccrazy4.jpg",
    type: "crazy"
  },
  {
    name: 'command5',
    path: "repeat 61 [fd 97 repeat 10 [bk 17 setsw 2 repeat 10 [tr 15 setsw 1 fd 1 tl 20 bk 18 tr 13]] tr 23 setsw 15 fd 17]",
    command: {
      "id": 0,
      "name": "repeat",
      "value": 61,
      "commands": [
         {
            "id": 1,
            "name": "fd",
            "value": 97
         },
         {
            "id": 2,
            "name": "repeat",
            "value": 10,
            "commands": [
               {
                  "id": 3,
                  "name": "bk",
                  "value": 17
               },
               {
                  "id": 4,
                  "name": "setsw",
                  "value": 2
               },
               {
                  "id": 5,
                  "name": "repeat",
                  "value": 10,
                  "commands": [
                     {
                        "id": 6,
                        "name": "tr",
                        "value": 15
                     },
                     {
                        "id": 7,
                        "name": "setsw",
                        "value": 1
                     },
                     {
                        "id": 8,
                        "name": "fd",
                        "value": 1
                     },
                     {
                        "id": 9,
                        "name": "tl",
                        "value": 20
                     },
                     {
                        "id": 10,
                        "name": "bk",
                        "value": 18
                     },
                     {
                        "id": 11,
                        "name": "tr",
                        "value": 13
                     }
                  ]
               }
            ]
         },
         {
            "id": 4,
            "name": "tr",
            "value": 23
         },
         {
            "id": 5,
            "name": "setsw",
            "value": 15
         },
         {
            "id": 6,
            "name": "fd",
            "value": 17
         }
      ]
   },
    image: "ccrazy5.jpg",
    type: "crazy"
  },
  {
    name: 'command6',
    path: "repeat 61 [fd 97 repeat 23 [bk 1 setsw 1 fd 12 repeat 10 [tr 9 fd 1 setsw 1 tl 20 bk 7 tr 13]] tr 23 setsw 7 fd 14]",
    command: {
      "id": 0,
      "name": "repeat",
      "value": 61,
      "commands": [
         {
            "id": 1,
            "name": "fd",
            "value": 97
         },
         {
            "id": 2,
            "name": "repeat",
            "value": 23,
            "commands": [
               {
                  "id": 3,
                  "name": "bk",
                  "value": 1
               },
               {
                  "id": 4,
                  "name": "setsw",
                  "value": 1
               },
               {
                  "id": 5,
                  "name": "fd",
                  "value": 12
               },
               {
                  "id": 6,
                  "name": "repeat",
                  "value": 10,
                  "commands": [
                     {
                        "id": 7,
                        "name": "tr",
                        "value": 9
                     },
                     {
                        "id": 8,
                        "name": "fd",
                        "value": 1
                     },
                     {
                        "id": 9,
                        "name": "setsw",
                        "value": 1
                     },
                     {
                        "id": 10,
                        "name": "tl",
                        "value": 20
                     },
                     {
                        "id": 11,
                        "name": "bk",
                        "value": 7
                     },
                     {
                        "id": 12,
                        "name": "tr",
                        "value": 13
                     }
                  ]
               }
            ]
         },
         {
            "id": 4,
            "name": "tr",
            "value": 23
         },
         {
            "id": 5,
            "name": "setsw",
            "value": 7
         },
         {
            "id": 6,
            "name": "fd",
            "value": 14
         }
      ]
   },
    image: "ccrazy6.jpg",
    type: "crazy"
  },
  {
    name: 'command7',
    path: "repeat 46 [fd 97 repeat 23 [bk 1 setsw 1 fd 12 repeat 4 [tr 9 fd 1 setsw 1 tl 20 bk 7 tr 13]] tr 22 setsw 2 fd 12]",
    command: {
      "id": 0,
      "name": "repeat",
      "value": 46,
      "commands": [
         {
            "id": 1,
            "name": "fd",
            "value": 97
         },
         {
            "id": 2,
            "name": "repeat",
            "value": 23,
            "commands": [
               {
                  "id": 3,
                  "name": "bk",
                  "value": 1
               },
               {
                  "id": 4,
                  "name": "setsw",
                  "value": 1
               },
               {
                  "id": 5,
                  "name": "fd",
                  "value": 12
               },
               {
                  "id": 6,
                  "name": "repeat",
                  "value": 4,
                  "commands": [
                     {
                        "id": 7,
                        "name": "tr",
                        "value": 9
                     },
                     {
                        "id": 8,
                        "name": "fd",
                        "value": 1
                     },
                     {
                        "id": 9,
                        "name": "setsw",
                        "value": 1
                     },
                     {
                        "id": 10,
                        "name": "tl",
                        "value": 20
                     },
                     {
                        "id": 11,
                        "name": "bk",
                        "value": 7
                     },
                     {
                        "id": 12,
                        "name": "tr",
                        "value": 13
                     }
                  ]
               }
            ]
         },
         {
            "id": 4,
            "name": "tr",
            "value": 22
         },
         {
            "id": 5,
            "name": "setsw",
            "value": 2
         },
         {
            "id": 6,
            "name": "fd",
            "value": 12
         }
      ]
   },
    image: "ccrazy7.jpg",
    type: "crazy"
  },
  {
    name: 'command8',
    path: "fd 160 tr 48 tl 111 repeat 50 [fd 97 repeat 23 [bk 1 setsw 3 fd 11 repeat 5 [tr 9 fd 1 setsw 2 tl 20 bk 7 tr 13]] tr 21 setsw 1 fd 10]",
    command: {
      "id": 3,
      "name": "repeat",
      "value": 50,
      "commands": [
         {
            "id": 4,
            "name": "fd",
            "value": 97
         },
         {
            "id": 5,
            "name": "repeat",
            "value": 23,
            "commands": [
               {
                  "id": 6,
                  "name": "bk",
                  "value": 1
               },
               {
                  "id": 7,
                  "name": "setsw",
                  "value": 3
               },
               {
                  "id": 8,
                  "name": "fd",
                  "value": 11
               },
               {
                  "id": 9,
                  "name": "repeat",
                  "value": 5,
                  "commands": [
                     {
                        "id": 10,
                        "name": "tr",
                        "value": 9
                     },
                     {
                        "id": 11,
                        "name": "fd",
                        "value": 1
                     },
                     {
                        "id": 12,
                        "name": "setsw",
                        "value": 2
                     },
                     {
                        "id": 13,
                        "name": "tl",
                        "value": 20
                     },
                     {
                        "id": 14,
                        "name": "bk",
                        "value": 7
                     },
                     {
                        "id": 15,
                        "name": "tr",
                        "value": 13
                     }
                  ]
               }
            ]
         },
         {
            "id": 7,
            "name": "tr",
            "value": 21
         },
         {
            "id": 8,
            "name": "setsw",
            "value": 1
         },
         {
            "id": 9,
            "name": "fd",
            "value": 10
         }
      ]
   },
    image: "ccrazy8.jpg",
    type: "crazy"
  },
  {
    name: 'command9',
    path: "repeat 50 [fd 97 repeat 50 [bk 14 setsw 0 fd 11 repeat 5 [tr 37 fd 1 setsw 2 tl 23 bk 42 tr 17]] tr 24 setsw 65 fd 10]",
    command: {
      "id": 0,
      "name": "repeat",
      "value": 50,
      "commands": [
         {
            "id": 1,
            "name": "fd",
            "value": 97
         },
         {
            "id": 2,
            "name": "repeat",
            "value": 50,
            "commands": [
               {
                  "id": 3,
                  "name": "bk",
                  "value": 14
               },
               {
                  "id": 4,
                  "name": "setsw",
                  "value": 0
               },
               {
                  "id": 5,
                  "name": "fd",
                  "value": 11
               },
               {
                  "id": 6,
                  "name": "repeat",
                  "value": 5,
                  "commands": [
                     {
                        "id": 7,
                        "name": "tr",
                        "value": 37
                     },
                     {
                        "id": 8,
                        "name": "fd",
                        "value": 1
                     },
                     {
                        "id": 9,
                        "name": "setsw",
                        "value": 2
                     },
                     {
                        "id": 10,
                        "name": "tl",
                        "value": 23
                     },
                     {
                        "id": 11,
                        "name": "bk",
                        "value": 42
                     },
                     {
                        "id": 12,
                        "name": "tr",
                        "value": 17
                     }
                  ]
               }
            ]
         },
         {
            "id": 4,
            "name": "tr",
            "value": 24
         },
         {
            "id": 5,
            "name": "setsw",
            "value": 65
         },
         {
            "id": 6,
            "name": "fd",
            "value": 10
         }
      ]
   },
    image: "ccrazy9.jpg",
    type: "crazy"
  },
  {
    name: 'command10',
    path: "repeat 150 [fd 99 setsw 3 repeat 19 [bk 90 repeat 10 [tr 15 tl 15 bk 10 tr 62]] tr 16]",
    command: {
      "id": 0,
      "name": "repeat",
      "value": 150,
      "commands": [
         {
            "id": 1,
            "name": "fd",
            "value": 99
         },
         {
            "id": 2,
            "name": "setsw",
            "value": 3
         },
         {
            "id": 3,
            "name": "repeat",
            "value": 19,
            "commands": [
               {
                  "id": 4,
                  "name": "bk",
                  "value": 90
               },
               {
                  "id": 5,
                  "name": "repeat",
                  "value": 10,
                  "commands": [
                     {
                        "id": 6,
                        "name": "tr",
                        "value": 15
                     },
                     {
                        "id": 7,
                        "name": "tl",
                        "value": 15
                     },
                     {
                        "id": 8,
                        "name": "bk",
                        "value": 10
                     },
                     {
                        "id": 9,
                        "name": "tr",
                        "value": 62
                     }
                  ]
               }
            ]
         },
         {
            "id": 5,
            "name": "tr",
            "value": 16
         }
      ]
   },
    image: "ccrazy10.jpg",
    type: "crazy"
  },
  {
    name: 'command11',
    path: "repeat 10 [fd 97 repeat 33 [setsw 0 fd 116 repeat 5 [tr 18 fd 1 setsw 1 bk 42 tr 31]] tr 4 setsw 2 fd 10]",
    command: {
      "id": 0,
      "name": "repeat",
      "value": 10,
      "commands": [
         {
            "id": 1,
            "name": "fd",
            "value": 97
         },
         {
            "id": 2,
            "name": "repeat",
            "value": 33,
            "commands": [
               {
                  "id": 3,
                  "name": "setsw",
                  "value": 0
               },
               {
                  "id": 4,
                  "name": "fd",
                  "value": 116
               },
               {
                  "id": 5,
                  "name": "repeat",
                  "value": 5,
                  "commands": [
                     {
                        "id": 6,
                        "name": "tr",
                        "value": 18
                     },
                     {
                        "id": 7,
                        "name": "fd",
                        "value": 1
                     },
                     {
                        "id": 8,
                        "name": "setsw",
                        "value": 1
                     },
                     {
                        "id": 9,
                        "name": "bk",
                        "value": 42
                     },
                     {
                        "id": 10,
                        "name": "tr",
                        "value": 31
                     }
                  ]
               }
            ]
         },
         {
            "id": 4,
            "name": "tr",
            "value": 4
         },
         {
            "id": 5,
            "name": "setsw",
            "value": 2
         },
         {
            "id": 6,
            "name": "fd",
            "value": 10
         }
      ]
   },
    image: "ccrazy11.jpg",
    type: "crazy"
  },
  {
    name: 'command12',
    path: "repeat 40 [fd 330 tr 1 repeat 20 [bk 4 tl 7 fd 1 repeat 12 [repeat 14 [fd 5 tr 4 bk 3] fd 11 tr 7] bk 4 tl 2] fd 4 tr 12]",
    command: {
      "id": 0,
      "name": "repeat",
      "value": 40,
      "commands": [
         {
            "id": 1,
            "name": "fd",
            "value": 330
         },
         {
            "id": 2,
            "name": "tr",
            "value": 1
         },
         {
            "id": 3,
            "name": "repeat",
            "value": 20,
            "commands": [
               {
                  "id": 4,
                  "name": "bk",
                  "value": 4
               },
               {
                  "id": 5,
                  "name": "tl",
                  "value": 7
               },
               {
                  "id": 6,
                  "name": "fd",
                  "value": 1
               },
               {
                  "id": 7,
                  "name": "repeat",
                  "value": 12,
                  "commands": [
                     {
                        "id": 8,
                        "name": "repeat",
                        "value": 14,
                        "commands": [
                           {
                              "id": 9,
                              "name": "fd",
                              "value": 5
                           },
                           {
                              "id": 10,
                              "name": "tr",
                              "value": 4
                           },
                           {
                              "id": 11,
                              "name": "bk",
                              "value": 3
                           }
                        ]
                     },
                     {
                        "id": 10,
                        "name": "fd",
                        "value": 11
                     },
                     {
                        "id": 11,
                        "name": "tr",
                        "value": 7
                     }
                  ]
               },
               {
                  "id": 9,
                  "name": "bk",
                  "value": 4
               },
               {
                  "id": 10,
                  "name": "tl",
                  "value": 2
               }
            ]
         },
         {
            "id": 5,
            "name": "fd",
            "value": 4
         },
         {
            "id": 6,
            "name": "tr",
            "value": 12
         }
      ]
   },
    image: "ccrazy12.jpg",
    type: "crazy"
  },  
  {
    name: 'command1',    
    path: "repeat 100 [tr 5 fd 10 setsc abcdef bk 150 tl 10 setsc 0ef12b repeat 10 [repeat 15 [fd 5 setsc a33a93 tr 15 bk 10 setsc 616161 tl 19 bk 55 fd 10 setsc e3ce45 tl 30 bk 20]]]",
    command: {
      "id": 0,
      "name": "repeat",
      "value": 100,
      "commands": [
         {
            "id": 1,
            "name": "tr",
            "value": 5
         },
         {
            "id": 2,
            "name": "fd",
            "value": 10
         },
         {
            "id": 3,
            "name": "setsc",
            "color": "#abcdef"
         },
         {
            "id": 4,
            "name": "bk",
            "value": 150
         },
         {
            "id": 5,
            "name": "tl",
            "value": 10
         },
         {
            "id": 6,
            "name": "setsc",
            "color": "#0ef12b"
         },
         {
            "id": 7,
            "name": "repeat",
            "value": 10,
            "commands": [
               {
                  "id": 8,
                  "name": "repeat",
                  "value": 15,
                  "commands": [
                     {
                        "id": 9,
                        "name": "fd",
                        "value": 5
                     },
                     {
                        "id": 10,
                        "name": "setsc",
                        "color": "#a33a93"
                     },
                     {
                        "id": 11,
                        "name": "tr",
                        "value": 15
                     },
                     {
                        "id": 12,
                        "name": "bk",
                        "value": 10
                     },
                     {
                        "id": 13,
                        "name": "setsc",
                        "color": "#616161"
                     },
                     {
                        "id": 14,
                        "name": "tl",
                        "value": 19
                     },
                     {
                        "id": 15,
                        "name": "bk",
                        "value": 55
                     },
                     {
                        "id": 16,
                        "name": "fd",
                        "value": 10
                     },
                     {
                        "id": 17,
                        "name": "setsc",
                        "color": "#e3ce45"
                     },
                     {
                        "id": 18,
                        "name": "tl",
                        "value": 30
                     },
                     {
                        "id": 19,
                        "name": "bk",
                        "value": 20
                     }
                  ]
               }
            ]
         }
      ]
   },
    image: "ccolor1.jpg",
    type: "color"
  },
  {
   name: 'command2',    
   path: "repeat 100 [tr 11 fd 12 setsc ff1500 bk 150 tl 18 setsc 7f00ff repeat 11 [repeat 31 [fd 5 setsc 00f2ff tr 15 bk 10 setsc 006eff tl 19 bk 55 fd 10 setsc ff8c00 tl 30 bk 20]]]",
   command: {
      "id": 0,
      "name": "repeat",
      "value": 100,
      "commands": [
         {
            "id": 1,
            "name": "tr",
            "value": 11
         },
         {
            "id": 2,
            "name": "fd",
            "value": 12
         },
         {
            "id": 3,
            "name": "setsc",
            "color": "#ff1500"
         },
         {
            "id": 4,
            "name": "bk",
            "value": 150
         },
         {
            "id": 5,
            "name": "tl",
            "value": 18
         },
         {
            "id": 6,
            "name": "setsc",
            "color": "#7f00ff"
         },
         {
            "id": 7,
            "name": "repeat",
            "value": 11,
            "commands": [
               {
                  "id": 8,
                  "name": "repeat",
                  "value": 31,
                  "commands": [
                     {
                        "id": 9,
                        "name": "fd",
                        "value": 5
                     },
                     {
                        "id": 10,
                        "name": "setsc",
                        "color": "#00f2ff"
                     },
                     {
                        "id": 11,
                        "name": "tr",
                        "value": 15
                     },
                     {
                        "id": 12,
                        "name": "bk",
                        "value": 10
                     },
                     {
                        "id": 13,
                        "name": "setsc",
                        "color": "#006eff"
                     },
                     {
                        "id": 14,
                        "name": "tl",
                        "value": 19
                     },
                     {
                        "id": 15,
                        "name": "bk",
                        "value": 55
                     },
                     {
                        "id": 16,
                        "name": "fd",
                        "value": 10
                     },
                     {
                        "id": 17,
                        "name": "setsc",
                        "color": "#ff8c00"
                     },
                     {
                        "id": 18,
                        "name": "tl",
                        "value": 30
                     },
                     {
                        "id": 19,
                        "name": "bk",
                        "value": 20
                     }
                  ]
               }
            ]
         }
      ]
   },
   image: "ccolor2.jpg",
   type: "color"
 },
 {
   name: 'command3',    
   path: "repeat 100 [tr 11 fd 12 setsc 4a4a4a bk 150 tl 28 setsc 808080 repeat 11 [repeat 34 [fd 5 setsc 454545 tr 15 bk 10 setsc ababab tl 19 bk 55 fd 10 setsc d4d4d4 tl 30 bk 20]]]",
   command: {
      "id": 0,
      "name": "repeat",
      "value": 100,
      "commands": [
         {
            "id": 1,
            "name": "tr",
            "value": 11
         },
         {
            "id": 2,
            "name": "fd",
            "value": 12
         },
         {
            "id": 3,
            "name": "setsc",
            "color": "#4a4a4a"
         },
         {
            "id": 4,
            "name": "bk",
            "value": 150
         },
         {
            "id": 5,
            "name": "tl",
            "value": 28
         },
         {
            "id": 6,
            "name": "setsc",
            "color": "#808080"
         },
         {
            "id": 7,
            "name": "repeat",
            "value": 11,
            "commands": [
               {
                  "id": 8,
                  "name": "repeat",
                  "value": 34,
                  "commands": [
                     {
                        "id": 9,
                        "name": "fd",
                        "value": 5
                     },
                     {
                        "id": 10,
                        "name": "setsc",
                        "color": "#454545"
                     },
                     {
                        "id": 11,
                        "name": "tr",
                        "value": 15
                     },
                     {
                        "id": 12,
                        "name": "bk",
                        "value": 10
                     },
                     {
                        "id": 13,
                        "name": "setsc",
                        "color": "#ababab"
                     },
                     {
                        "id": 14,
                        "name": "tl",
                        "value": 19
                     },
                     {
                        "id": 15,
                        "name": "bk",
                        "value": 55
                     },
                     {
                        "id": 16,
                        "name": "fd",
                        "value": 10
                     },
                     {
                        "id": 17,
                        "name": "setsc",
                        "color": "#d4d4d4"
                     },
                     {
                        "id": 18,
                        "name": "tl",
                        "value": 30
                     },
                     {
                        "id": 19,
                        "name": "bk",
                        "value": 20
                     }
                  ]
               }
            ]
         }
      ]
   },
   image: "ccolor3.jpg",
   type: "color"
 },
 {
   name: 'command4',    
   path: "repeat 100 [tr 11 fd 12 setsc c9d2fd bk 150 tl 34 setsc 909bd0 repeat 17 [repeat 34 [fd 5 setsc 5f71c4 tr 16 bk 120 setsc 4561de tl 19 bk 5 fd 15 setsc e0e3f0 tl 30 bk 20]]]",
   command: {
      "id": 0,
      "name": "repeat",
      "value": 100,
      "commands": [
         {
            "id": 1,
            "name": "tr",
            "value": 11
         },
         {
            "id": 2,
            "name": "fd",
            "value": 12
         },
         {
            "id": 3,
            "name": "setsc",
            "color": "#c9d2fd"
         },
         {
            "id": 4,
            "name": "bk",
            "value": 150
         },
         {
            "id": 5,
            "name": "tl",
            "value": 34
         },
         {
            "id": 6,
            "name": "setsc",
            "color": "#909bd0"
         },
         {
            "id": 7,
            "name": "repeat",
            "value": 17,
            "commands": [
               {
                  "id": 8,
                  "name": "repeat",
                  "value": 34,
                  "commands": [
                     {
                        "id": 9,
                        "name": "fd",
                        "value": 5
                     },
                     {
                        "id": 10,
                        "name": "setsc",
                        "color": "#5f71c4"
                     },
                     {
                        "id": 11,
                        "name": "tr",
                        "value": 16
                     },
                     {
                        "id": 12,
                        "name": "bk",
                        "value": 120
                     },
                     {
                        "id": 13,
                        "name": "setsc",
                        "color": "#4561de"
                     },
                     {
                        "id": 14,
                        "name": "tl",
                        "value": 19
                     },
                     {
                        "id": 15,
                        "name": "bk",
                        "value": 5
                     },
                     {
                        "id": 16,
                        "name": "fd",
                        "value": 15
                     },
                     {
                        "id": 17,
                        "name": "setsc",
                        "color": "#e0e3f0"
                     },
                     {
                        "id": 18,
                        "name": "tl",
                        "value": 30
                     },
                     {
                        "id": 19,
                        "name": "bk",
                        "value": 20
                     }
                  ]
               }
            ]
         }
      ]
   },
   image: "ccolor4.jpg",
   type: "color"
 },
 {
   name: 'command5',    
   path: "repeat 12 [tr 10 fd 5 setsc c9d2fd bk 153 tl 39 setsc 909bd0 repeat 27 [repeat 48 [fd 5 setsc 5f71c4 tr 27 bk 112 setsc 4561de tl 21 bk 9 fd 13 setsc e0e3f0 tl 39 bk 20]]]",
   command: {
      "id": 0,
      "name": "repeat",
      "value": 12,
      "commands": [
         {
            "id": 1,
            "name": "tr",
            "value": 10
         },
         {
            "id": 2,
            "name": "fd",
            "value": 5
         },
         {
            "id": 3,
            "name": "setsc",
            "color": "#c9d2fd"
         },
         {
            "id": 4,
            "name": "bk",
            "value": 153
         },
         {
            "id": 5,
            "name": "tl",
            "value": 39
         },
         {
            "id": 6,
            "name": "setsc",
            "color": "#909bd0"
         },
         {
            "id": 7,
            "name": "repeat",
            "value": 27,
            "commands": [
               {
                  "id": 8,
                  "name": "repeat",
                  "value": 48,
                  "commands": [
                     {
                        "id": 9,
                        "name": "fd",
                        "value": 5
                     },
                     {
                        "id": 10,
                        "name": "setsc",
                        "color": "#5f71c4"
                     },
                     {
                        "id": 11,
                        "name": "tr",
                        "value": 27
                     },
                     {
                        "id": 12,
                        "name": "bk",
                        "value": 112
                     },
                     {
                        "id": 13,
                        "name": "setsc",
                        "color": "#4561de"
                     },
                     {
                        "id": 14,
                        "name": "tl",
                        "value": 21
                     },
                     {
                        "id": 15,
                        "name": "bk",
                        "value": 9
                     },
                     {
                        "id": 16,
                        "name": "fd",
                        "value": 13
                     },
                     {
                        "id": 17,
                        "name": "setsc",
                        "color": "#e0e3f0"
                     },
                     {
                        "id": 18,
                        "name": "tl",
                        "value": 39
                     },
                     {
                        "id": 19,
                        "name": "bk",
                        "value": 20
                     }
                  ]
               }
            ]
         }
      ]
   },
   image: "ccolor5.jpg",
   type: "color"
 },
 {
   name: 'command6',    
   path: "repeat 8 [tr 15 fd 1 setsc debad3 bk 15 tl 47 setsc daa9cc repeat 27 [fd 10 tr 10 bk 10 tl 42 repeat 84 [fd 57 setsc 4d3345 tr 31 bk 11 setsc 5f3f55 tl 21 bk 9 fd 13 setsc ba97af tl 39 bk 20]]]",
   command: {
      "id": 0,
      "name": "repeat",
      "value": 8,
      "commands": [
         {
            "id": 1,
            "name": "tr",
            "value": 15
         },
         {
            "id": 2,
            "name": "fd",
            "value": 1
         },
         {
            "id": 3,
            "name": "setsc",
            "color": "#debad3"
         },
         {
            "id": 4,
            "name": "bk",
            "value": 15
         },
         {
            "id": 5,
            "name": "tl",
            "value": 47
         },
         {
            "id": 6,
            "name": "setsc",
            "color": "#daa9cc"
         },
         {
            "id": 7,
            "name": "repeat",
            "value": 27,
            "commands": [
               {
                  "id": 8,
                  "name": "fd",
                  "value": 10
               },
               {
                  "id": 9,
                  "name": "tr",
                  "value": 10
               },
               {
                  "id": 10,
                  "name": "bk",
                  "value": 10
               },
               {
                  "id": 11,
                  "name": "tl",
                  "value": 42
               },
               {
                  "id": 12,
                  "name": "repeat",
                  "value": 84,
                  "commands": [
                     {
                        "id": 13,
                        "name": "fd",
                        "value": 57
                     },
                     {
                        "id": 14,
                        "name": "setsc",
                        "color": "#4d3345"
                     },
                     {
                        "id": 15,
                        "name": "tr",
                        "value": 31
                     },
                     {
                        "id": 16,
                        "name": "bk",
                        "value": 11
                     },
                     {
                        "id": 17,
                        "name": "setsc",
                        "color": "#5f3f55"
                     },
                     {
                        "id": 18,
                        "name": "tl",
                        "value": 21
                     },
                     {
                        "id": 19,
                        "name": "bk",
                        "value": 9
                     },
                     {
                        "id": 20,
                        "name": "fd",
                        "value": 13
                     },
                     {
                        "id": 21,
                        "name": "setsc",
                        "color": "#ba97af"
                     },
                     {
                        "id": 22,
                        "name": "tl",
                        "value": 39
                     },
                     {
                        "id": 23,
                        "name": "bk",
                        "value": 20
                     }
                  ]
               }
            ]
         }
      ]
   },
   image: "ccolor6.jpg",
   type: "color"
 },
 {
   name: 'command7',    
   path: "repeat 8 [tr 15 fd 1 setsc debad3 bk 15 tl 47 setsc daa9cc repeat 27 [fd 10 tr 10 bk 10 tl 42 repeat 84 [fd 57 setsc 4d3345 tr 39 bk 11 setsc 5f3f55 tl 21 bk 9 fd 13 setsc ba97af tl 39 bk 20]]]",
   command: {
      "id": 0,
      "name": "repeat",
      "value": 8,
      "commands": [
         {
            "id": 1,
            "name": "tr",
            "value": 15
         },
         {
            "id": 2,
            "name": "fd",
            "value": 1
         },
         {
            "id": 3,
            "name": "setsc",
            "color": "#debad3"
         },
         {
            "id": 4,
            "name": "bk",
            "value": 15
         },
         {
            "id": 5,
            "name": "tl",
            "value": 47
         },
         {
            "id": 6,
            "name": "setsc",
            "color": "#daa9cc"
         },
         {
            "id": 7,
            "name": "repeat",
            "value": 27,
            "commands": [
               {
                  "id": 8,
                  "name": "fd",
                  "value": 10
               },
               {
                  "id": 9,
                  "name": "tr",
                  "value": 10
               },
               {
                  "id": 10,
                  "name": "bk",
                  "value": 10
               },
               {
                  "id": 11,
                  "name": "tl",
                  "value": 42
               },
               {
                  "id": 12,
                  "name": "repeat",
                  "value": 84,
                  "commands": [
                     {
                        "id": 13,
                        "name": "fd",
                        "value": 57
                     },
                     {
                        "id": 14,
                        "name": "setsc",
                        "color": "#4d3345"
                     },
                     {
                        "id": 15,
                        "name": "tr",
                        "value": 39
                     },
                     {
                        "id": 16,
                        "name": "bk",
                        "value": 11
                     },
                     {
                        "id": 17,
                        "name": "setsc",
                        "color": "#5f3f55"
                     },
                     {
                        "id": 18,
                        "name": "tl",
                        "value": 21
                     },
                     {
                        "id": 19,
                        "name": "bk",
                        "value": 9
                     },
                     {
                        "id": 20,
                        "name": "fd",
                        "value": 13
                     },
                     {
                        "id": 21,
                        "name": "setsc",
                        "color": "#ba97af"
                     },
                     {
                        "id": 22,
                        "name": "tl",
                        "value": 39
                     },
                     {
                        "id": 23,
                        "name": "bk",
                        "value": 20
                     }
                  ]
               }
            ]
         }
      ]
   },
   image: "ccolor7.jpg",
   type: "color"
 },
 {
   name: 'command8',    
   path: "repeat 8 [tr 15 fd 1 setsc debad3 bk 15 tl 47 setsc daa9cc repeat 27 [fd 10 tr 10 bk 10 tl 74 repeat 88 [fd 57 setsc 4d3345 tr 39 bk 11 setsc 5f3f55 tl 29 bk 9 fd 13 setsc ba97af tl 39 bk 20]]]",
   command: {
      "id": 0,
      "name": "repeat",
      "value": 8,
      "commands": [
         {
            "id": 1,
            "name": "tr",
            "value": 15
         },
         {
            "id": 2,
            "name": "fd",
            "value": 1
         },
         {
            "id": 3,
            "name": "setsc",
            "color": "#debad3"
         },
         {
            "id": 4,
            "name": "bk",
            "value": 15
         },
         {
            "id": 5,
            "name": "tl",
            "value": 47
         },
         {
            "id": 6,
            "name": "setsc",
            "color": "#daa9cc"
         },
         {
            "id": 7,
            "name": "repeat",
            "value": 27,
            "commands": [
               {
                  "id": 8,
                  "name": "fd",
                  "value": 10
               },
               {
                  "id": 9,
                  "name": "tr",
                  "value": 10
               },
               {
                  "id": 10,
                  "name": "bk",
                  "value": 10
               },
               {
                  "id": 11,
                  "name": "tl",
                  "value": 74
               },
               {
                  "id": 12,
                  "name": "repeat",
                  "value": 88,
                  "commands": [
                     {
                        "id": 13,
                        "name": "fd",
                        "value": 57
                     },
                     {
                        "id": 14,
                        "name": "setsc",
                        "color": "#4d3345"
                     },
                     {
                        "id": 15,
                        "name": "tr",
                        "value": 39
                     },
                     {
                        "id": 16,
                        "name": "bk",
                        "value": 11
                     },
                     {
                        "id": 17,
                        "name": "setsc",
                        "color": "#5f3f55"
                     },
                     {
                        "id": 18,
                        "name": "tl",
                        "value": 29
                     },
                     {
                        "id": 19,
                        "name": "bk",
                        "value": 9
                     },
                     {
                        "id": 20,
                        "name": "fd",
                        "value": 13
                     },
                     {
                        "id": 21,
                        "name": "setsc",
                        "color": "#ba97af"
                     },
                     {
                        "id": 22,
                        "name": "tl",
                        "value": 39
                     },
                     {
                        "id": 23,
                        "name": "bk",
                        "value": 20
                     }
                  ]
               }
            ]
         }
      ]
   },
   image: "ccolor8.jpg",
   type: "color"
 },
 {
   name: 'command9',    
   path: "repeat 8 [tr 15 fd 1 setsc debad3 bk 15 tl 47 setsc daa9cc repeat 27 [fd 10 tr 10 bk 10 tl 74 repeat 88 [fd 90 setsc 4d3345 tr 40 bk 11 setsc 5f3f55 tl 34 bk 9 fd 13 setsc ba97af tl 39 bk 20]]]",
   command: {
      "id": 0,
      "name": "repeat",
      "value": 8,
      "commands": [
         {
            "id": 1,
            "name": "tr",
            "value": 15
         },
         {
            "id": 2,
            "name": "fd",
            "value": 1
         },
         {
            "id": 3,
            "name": "setsc",
            "color": "#debad3"
         },
         {
            "id": 4,
            "name": "bk",
            "value": 15
         },
         {
            "id": 5,
            "name": "tl",
            "value": 47
         },
         {
            "id": 6,
            "name": "setsc",
            "color": "#daa9cc"
         },
         {
            "id": 7,
            "name": "repeat",
            "value": 27,
            "commands": [
               {
                  "id": 8,
                  "name": "fd",
                  "value": 10
               },
               {
                  "id": 9,
                  "name": "tr",
                  "value": 10
               },
               {
                  "id": 10,
                  "name": "bk",
                  "value": 10
               },
               {
                  "id": 11,
                  "name": "tl",
                  "value": 74
               },
               {
                  "id": 12,
                  "name": "repeat",
                  "value": 88,
                  "commands": [
                     {
                        "id": 13,
                        "name": "fd",
                        "value": 90
                     },
                     {
                        "id": 14,
                        "name": "setsc",
                        "color": "#4d3345"
                     },
                     {
                        "id": 15,
                        "name": "tr",
                        "value": 40
                     },
                     {
                        "id": 16,
                        "name": "bk",
                        "value": 11
                     },
                     {
                        "id": 17,
                        "name": "setsc",
                        "color": "#5f3f55"
                     },
                     {
                        "id": 18,
                        "name": "tl",
                        "value": 34
                     },
                     {
                        "id": 19,
                        "name": "bk",
                        "value": 9
                     },
                     {
                        "id": 20,
                        "name": "fd",
                        "value": 13
                     },
                     {
                        "id": 21,
                        "name": "setsc",
                        "color": "#ba97af"
                     },
                     {
                        "id": 22,
                        "name": "tl",
                        "value": 39
                     },
                     {
                        "id": 23,
                        "name": "bk",
                        "value": 20
                     }
                  ]
               }
            ]
         }
      ]
   },
   image: "ccolor9.jpg",
   type: "color"
 },
 {
   name: 'command10',    
   path: "repeat 8 [tr 25 fd 10 setsc debad3 bk 15 tl 50 setsc daa9cc repeat 4 [fd 130 tr 41 bk 10 tl 64 repeat 88 [fd 90 setsc 4d3345 tr 31 bk 9 setsc 5f3f55 tl 34 bk 11 fd 11 setsc ba97af tl 34 bk 20]]]",
   command: {
      "id": 0,
      "name": "repeat",
      "value": 8,
      "commands": [
         {
            "id": 1,
            "name": "tr",
            "value": 25
         },
         {
            "id": 2,
            "name": "fd",
            "value": 10
         },
         {
            "id": 3,
            "name": "setsc",
            "color": "#debad3"
         },
         {
            "id": 4,
            "name": "bk",
            "value": 15
         },
         {
            "id": 5,
            "name": "tl",
            "value": 50
         },
         {
            "id": 6,
            "name": "setsc",
            "color": "#daa9cc"
         },
         {
            "id": 7,
            "name": "repeat",
            "value": 4,
            "commands": [
               {
                  "id": 8,
                  "name": "fd",
                  "value": 130
               },
               {
                  "id": 9,
                  "name": "tr",
                  "value": 41
               },
               {
                  "id": 10,
                  "name": "bk",
                  "value": 10
               },
               {
                  "id": 11,
                  "name": "tl",
                  "value": 64
               },
               {
                  "id": 12,
                  "name": "repeat",
                  "value": 88,
                  "commands": [
                     {
                        "id": 13,
                        "name": "fd",
                        "value": 90
                     },
                     {
                        "id": 14,
                        "name": "setsc",
                        "color": "#4d3345"
                     },
                     {
                        "id": 15,
                        "name": "tr",
                        "value": 31
                     },
                     {
                        "id": 16,
                        "name": "bk",
                        "value": 9
                     },
                     {
                        "id": 17,
                        "name": "setsc",
                        "color": "#5f3f55"
                     },
                     {
                        "id": 18,
                        "name": "tl",
                        "value": 34
                     },
                     {
                        "id": 19,
                        "name": "bk",
                        "value": 11
                     },
                     {
                        "id": 20,
                        "name": "fd",
                        "value": 11
                     },
                     {
                        "id": 21,
                        "name": "setsc",
                        "color": "#ba97af"
                     },
                     {
                        "id": 22,
                        "name": "tl",
                        "value": 34
                     },
                     {
                        "id": 23,
                        "name": "bk",
                        "value": 20
                     }
                  ]
               }
            ]
         }
      ]
   },
   image: "ccolor10.jpg",
   type: "color"
 }
];

export const pathwayExampleReducer = handleActions<RootState.PathwayExample, IPathwayExample>(
  {    
  },
  initialState
);
