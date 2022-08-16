import { useCallback, useEffect, useState } from "react";

import { Table } from 'antd';

import 'antd/dist/antd.css';

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

const okrColumns = [
  {
    title: 'OKR title',
    width: 300,
    dataIndex: "title",
    key: "1",
    fixed: "left"
  },
  {
    title: 'OKR info 1',
    with: 100,
    dataIndex: "info1",
    key: "2",
  },
  {
    title: 'OKR info 2',
    with: 100,
    dataIndex: "info2",
    key: "3",
  }
];


const NodeComponent = (props) => {
  const { handleChildInsertion, hideChildren, depth, nodeId, index, expanded } = props;
  return <div onClick={() => {
      if(expanded){
        hideChildren(nodeId, false);
      }else {
        handleChildInsertion(nodeId, index);
      }
    }}
    className="node-item"
    style={{paddingLeft: `${depth * 20}px`}}
    >
      {`Depth - ${depth} Node - ${nodeId}`}
    </div>;
}


const App = () => {

  const [nodeDataList, setNodeDataList] = useState(dataList);
  const [nodeData, setNodeData] = useState(data);
  const [treeData, setTreeData] = useState(null);
  
  const handleChildInsertion = useCallback((id, index) => {
    if(!childData[id]) return;

    const isChildrenAdded = nodeData[id]?.childrenAdded;

    if(!isChildrenAdded){
      const tempNodeList = [...nodeDataList];
        tempNodeList.splice(index + 1, 0, childData[id]);
        
        const final = tempNodeList.flat();

        setNodeDataList(final);
      }

    setNodeData(nodeData => ({...nodeData, [id]: {...nodeData[id], expanded: true, childrenAdded: true, clickExpanded: true}}))
  }, [nodeData, nodeDataList])

  const hideChildren = useCallback((id, clickExpanded) => {
    setNodeData(nodeData => ({...nodeData, [id]: {...nodeData[id], expanded: false, clickExpanded}}))
  }, [])

  useEffect(() => {
    const newNodeDataList = nodeDataList.filter((nodeId, index) => {
      const {expanded, parent, clickExpanded } = nodeData[nodeId];
      const isParentExpanded = nodeData[parent]?.expanded;
      
        if(!isParentExpanded && parent !== null) {
          if(expanded){
            hideChildren(nodeId, true);
          }
          return false;
        };
  
        if(isParentExpanded && clickExpanded && !expanded){
          handleChildInsertion(nodeId, index);
        }
  
        return true;
    });

    const newTreeData = newNodeDataList.map((nodeId, index) => {

      const { depth, clickExpanded, expanded } = nodeData[nodeId];

      return ({
        key: index,
        title: <NodeComponent 
          index={index} 
          nodeId={nodeId} 
          handleChildInsertion={handleChildInsertion} 
          hideChildren={hideChildren} 
          depth={depth} 
          expanded={expanded}
          clickExpanded={clickExpanded}
        />,
        info1: "Goal Information 1",
        info2: "Goal Information 2"
      });
    });
    
    setTreeData(newTreeData);
      
  }, [nodeDataList, nodeData]);
  


  return <div className="node-container">
   {/*  {
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
            if(expanded){
              hideChildren(nodeId, false);
            }else {
              handleChildInsertion(nodeId, index);
            }
          }}>
          {`Depth: ${depth}, Title: ${name} , Key: ${key}`}
        </div>;
      })
    } */}
    
    <div className="node-table">
      {treeData ? ( 
        <Table
          columns={okrColumns}
          dataSource={treeData}
          scroll={{
            x: 1500,
          }}
        />
      ) : null}
    </div>
  </div>;
}

export default App;
