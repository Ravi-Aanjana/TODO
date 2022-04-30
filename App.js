import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, TouchableHighlight, Image } from 'react-native';
import axios from 'axios';
import { SwipeListView } from 'react-native-swipe-list-view';

const App = () => {
  const [screen, setScreen] = useState('');
  const [udata, setUdata] = useState([]);
  const [toggle, setToggle] = useState(true);
  const [updateid,setUpdateid]=useState('')
  // const [isModalVisible, setIsModalVisible] = useState(false)
  // const [inputText, setInputText] = useState("");
  // const [EditItem, setEditItem] = useState();
  // const [isRender, setIsRender] = useState(false);

  // console.log("InputText", inputText)
  // const Updatedata = inputText;
  console.log('screen1234', screen);
  const textdata = screen;
  console.log("Mydata", textdata)
  console.log("myID",updateid);

  const GetDataApi = () => {
    setUdata([])
    fetch('https://api.todoist.com/rest/v1/tasks', {
      methdo: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ab9855583345f7886c83ac8d4afffe0832c7e975',
        'Cookie': 'csrf=ba44984fa3ef4a8eb18e30c8d6b8514b'
      },
    }).then((response) => response.json())
      .then((result) => {
        console.log(result)
        setUdata(result)
      }).catch((error) => {
        console.log(error)
      })

  }

  useEffect(() => {
    GetDataApi()
  }, [])

  const AddItemPost = () => {

    var axios = require('axios');
    var data = JSON.stringify({ "content": textdata });

    var config = {
      method: 'post',
      url: 'https://api.todoist.com/rest/v1/tasks',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ab9855583345f7886c83ac8d4afffe0832c7e975',
        'Accept': 'application/json'
      },
      data: data
    };

    axios(config)
      .then(function (response) {
        setUdata(response.data);
        GetDataApi()
        setScreen('');
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  const DeleteApiData = (id) => {
    var axios = require('axios');
    const data = ''
    var config = {
      method: 'delete',
      url: `https://api.todoist.com/rest/v1/tasks/${id}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ab9855583345f7886c83ac8d4afffe0832c7e975',
        'Cookie': 'csrf=ba44984fa3ef4a8eb18e30c8d6b8514b'
      },
      body: data
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.status));

        setUdata(JSON.stringify(response.data));
        GetDataApi()
      })
      .catch(function (error) {
        console.log('Errorr......', error);
      });
  }


  const UpdateItemApi = (id) => {
console.log('id============>',updateid);
console.log('id3333============>',textdata);
const content={
  content:textdata
}

var axios = require('axios');
var data = JSON.stringify(content);

var config = {
  method: 'post',
  url: `https://api.todoist.com/rest/v1/tasks/${id}`,
  headers: { 
    'Authorization': 'Bearer ab9855583345f7886c83ac8d4afffe0832c7e975', 
    'Content-Type': 'application/json', 
    'Cookie': 'csrf=ba44984fa3ef4a8eb18e30c8d6b8514b'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
   GetDataApi()
   setToggle(true)
   setScreen('')
})
.catch(function (error) {
  console.log(error);
});

  }

  //////////////////////
  const onItemOpen = id => {
    // console.log('This row opened', id);


  };

  const onPressItem = (item) => {
    // setIsModalVisible(true);
    setToggle(false);
    setScreen(item.content);
    console.log("Content Name", item.content)
    // setEditItem(item.id)
    console.log("ContentID", item.id)
   
    setUpdateid(item.id);
  }



  ///////////////////////////////////////////

  const renderItem = ({ item }) => {
    return (
      <>
        <TouchableHighlight
          //  onPress={() => console.log('You touched me')}
          style={styles.rowFront}
          underlayColor={'#fff'}
        >

          <View key={item.id}>

            <Text key={item.id} style={styles.list}>{item.content}</Text>

          </View>
        </TouchableHighlight>
      </>
    )
  }


  const renderHiddenItem = ({item})  => 
    (
<View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteBtn]}
        onPress={() => DeleteApiData(item.id)}
      >
        <Text style={styles.btnText}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onPressItem(item)}
        style={[styles.actionButton, styles.closeBtn]}
      >
        <Text style={styles.btnText}>Update</Text>

      </TouchableOpacity>
    </View>







    )
  
    
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.text}>Todo List</Text>
      </View>

      <View style={styles.input}>
        <TextInput placeholder='Enter Items' style={{ width: '50%', height: 40 }} value={screen}
          onChangeText={setScreen} />

        {toggle ?
          <TouchableOpacity style={styles.plus} onPress={AddItemPost}>
            <Text style={styles.add}>+</Text>
          </TouchableOpacity>
          :

          <TouchableOpacity onPress={()=>UpdateItemApi(updateid)}>
            <Image source={require('./assets/Edit.png')}
              style={styles.edit} />
          </TouchableOpacity>
        }


      </View>


      <SwipeListView
        data={udata}
        renderItem={renderItem}
        keyExtractor={(item) => {
          return item.id;
        }}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={0}
        rightOpenValue={-150}
        onRowDidOpen={onItemOpen}

      />
      {/* <Modal
      animationType='fade' 
      visible={isModalVisible}
      onRequestClose={()=>setIsModalVisible(false)}
      >
        <View style={styles.modal}>
          <Text style={{fontSize:30,textAlign:'center'}}>Change Data</Text>
          <TextInput
          style={{width:300,height:50,borderWidth:1,top:10,borderRadius:15,color:'#000'}}
          onChangeText={(text)=>setInputText(text)}
          defaultValue={inputText}
          editable={true}
          multiline={false} 
          maxLength={200}
         />
          <TouchableOpacity style={styles.btn}
          onPress={()=>UpdateItemApi()}>
            <Text>Updates</Text>
          </TouchableOpacity>
        </View>
      </Modal>
 */}



    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: '100%',
    height: 60,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: 'white',
    fontSize: 30
  },
  input: {
    width: '80%',
    height: 50,
    borderWidth: 1.5,
    borderColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 15,
    marginLeft: 40,
    flexDirection: 'row'
  },
  plus: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    marginLeft: '30%'
  },
  add: {
    fontSize: 20,
    color: 'white',

  },
  items: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
  },
  itembox: {
    width: 250,
    height: 40,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  img: {

    height: 30,
    width: 40
  },
  imgstyle: {
    flexDirection: 'row'
  },



  list: {
    color: '#FFF',
  },
  btnText: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: 'lightcoral',
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
    justifyContent: 'center',
    height: 50,
    marginTop: 10
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 5,
  },
  actionButton: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  closeBtn: {
    backgroundColor: 'blue',
    right: 75,
    marginTop: 10
  },
  deleteBtn: {
    backgroundColor: 'red',
    right: 0,
    marginTop: 10
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btn: {
    width: 200,
    height: 40,
    borderWidth: 1,
    top: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15
  },
  edit: {
    width: 50,
    height: 40,
    left:30
  }

})
export default App;







{/* <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}  > */ }
{/* <View style={styles.itembox} > */ }
{/* <Text key={item.id} style={styles.list}>{item.content}</Text> */ }
{/* </View> */ }

{/* <TouchableOpacity style={styles.imgstyle} onPress={()=>DeleteApiData(item.id)}>
            <Image source={require('./assets/delete.jpg')}
              style={styles.img} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.imgstyle} onPress={()=>EditApiData()}>
            <Image source={require('./assets/Edit.png')}
              style={styles.img} />
          </TouchableOpacity> */}
{/* </View> */ }