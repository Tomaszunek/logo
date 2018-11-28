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
    name: 'command36',
    path: "command1",
    command: {id: 0, name: "fd"},
    image: "command1.jpg",
    type: "crazy"
  },
  {
    name: 'command37',    
    path: "command1",
    command: {id: 0, name: "fd"},
    image: "command1.jpg",
    type: "color"
  }
];

export const pathwayExampleReducer = handleActions<RootState.PathwayExample, IPathwayExample>(
  {    
  },
  initialState
);
