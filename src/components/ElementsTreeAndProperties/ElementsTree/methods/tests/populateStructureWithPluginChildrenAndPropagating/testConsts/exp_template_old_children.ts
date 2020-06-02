export default [
    { id: 'element_02', itemPath: [], path: [], tag: 'CMS variables' },
    { expanded: true, id: 'element_01', itemPath: [], path: [], tag: 'html' },
    {
        id: 'element_0',
        itemPath: ['element_01'],
        path: ['element_01'],
        tag: 'head',
    },
    {
        expanded: true,
        id: 'element_1',
        itemPath: ['element_01'],
        path: ['element_01'],
        tag: 'body',
    },
    {
        expanded: true,
        id: 'element_2',
        itemPath: ['element_01', 'element_1'],
        path: ['element_01', 'element_1'],
        tag: 'Lola',
    },
    {
        childrenTo: 'element_1',
        forChildren: true,
        forPlugin: '5ed4dd3058cd1e16badab1de',
        id: 'element_2_forPlugin_5ed4dd3058cd1e16badab1de_childrenTo_element_1',
        isChildren: false,
        path: ['element_01', 'element_1', 'element_2'],
        sourcePlugin: '',
        tag: 'Children for TestChild',
        text: false,
    },
]
