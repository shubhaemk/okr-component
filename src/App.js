import { useState } from "react";

import "./App.scss";

const dataList = [
  1
];

const data = {
  1: {
    key: 1,
    name: 'Node 1',
    depth: 1,
    parent: null,
    expanded: false,
    clickExpanded: false,
    childrenAdded: false
  },
  2: {
    key: 2,
    name: 'Node 2',
    depth: 2,
    parent: 1,
    expanded: false,
    clickExpanded: false,
    childrenAdded: false
  },
  3: {
    key: 3,
    name: 'Node 3',
    depth: 2,
    parent: 1,
    expanded: false,
    clickExpanded: false,
    childrenAdded: false
  },
  4: {
    key: 4,
    name: 'Node 4',
    depth: 3,
    parent: 2,
    expanded: false,
    clickExpanded: false,
    childrenAdded: false
  }
}

const childData = {
  1: [2, 3],
  2: [4]
}

const App = () => {

  const [nodeDataList, setNodeDataList] = useState(dataList);
  const [nodeData, setNodeData] = useState(data);

  const handleChildInsertion = (id, index) => {
    
    const isChildrenAdded = nodeData[id].childrenAdded;

    if(!isChildrenAdded){
      const tempNodeList = [...nodeDataList];
        tempNodeList.splice(index + 1, 0, childData[id]);
        
        const final = tempNodeList.flat();

        setNodeDataList(final);
      }

    setNodeData({...nodeData, [id]: {...nodeData[id], expanded: true, childrenAdded: true, clickExpanded: true}})
  };

  const hideChildren = (id, clickExpanded) => {
    setNodeData({...nodeData, [id]: {...nodeData[id], expanded: false, clickExpanded}})
  }

  console.log({nodeData})

  return <div className="node-container">
    {
      nodeDataList.map((nodeId, index) => {
        const {key, name, depth, expanded, parent, clickExpanded } = nodeData[nodeId];
        const isParentExpanded = nodeData[parent]?.expanded;
        
        if(!isParentExpanded && parent !== null) {
          if(expanded){
            hideChildren(nodeId, true);
          }
          return null;
        };

        if(isParentExpanded && clickExpanded && !expanded){
          handleChildInsertion(nodeId, index);
        }

        return <div key={key} style={{paddingLeft: `${depth * 20}px`}} className="node-item" onClick={() => {
            if(nodeData[nodeId].expanded){
              hideChildren(nodeId, false);
            }else {
              handleChildInsertion(nodeId, index);
            }
          }}>
          {`Depth: ${depth}, Title: ${name} , Key: ${key}`}
        </div>;
      })
    }
  </div>;
}

export default App;
