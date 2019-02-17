import React, { Component } from 'react'
import {StyleSheet,Text, View, Image, TouchableOpacity} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
export default class PopularItem extends Component {
  render() {
    const {projectModel} = this.props;
    const {item} = projectModel;
    
    if(!item || !item.owner) return null;

    let favoriteButton = <TouchableOpacity style={{padding:6}}
                     onPress = {()=>{

                     }}
                     underlayColor = {'transparent'}
                    >
                     <FontAwesome name={'star-o'}
                                  size={26}
                                  style={{color:'red'}}
                     >

                     </FontAwesome>

                    </TouchableOpacity>
    return (
      <TouchableOpacity 
      onPress = {this.props.onSelect}>
        <View style={styles.cell_container}>
            <Text style={styles.title}>
                {item.full_name}
            </Text>

            <Text style={styles.description}>
                {item.description}
            </Text>

           <View style={styles.row}>
           <View style={styles.row}>
                <Text>Author:</Text>
                <Image  style={{height:22,width:22}}
                        source={{uri:item.owner.avatar_url}}
                />
            </View>

            <View style={{flexDirection:'row', justifyContent: 'space-between',}}>
                   <Text>Star:</Text>
                   <Text>{item.stargazers_count}</Text>
            </View>
            {favoriteButton}
           </View>
        </View>
      </TouchableOpacity>
    )
  }
}


const styles = StyleSheet.create({
    cell_container:{
        backgroundColor: 'white',
        padding: 10,
        marginLeft: 5,
        marginRight: 5,
        marginVertical: 3,
        borderColor: '#dddddd',
        borderWidth: 0.5,
        borderRadius: 2,
        shadowColor: 'gray',
        shadowOffset: {width: 0.5, height: 0.5},
        shadowOpacity: 0.4,
        shadowRadius: 1,
        elevation: 2 // 安卓设置阴影
    },
    row:{
        justifyContent:'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    title:{
        fontSize: 16,
        marginBottom: 2,
        color: '#212121',
    },
    description: {
        fontSize: 14,
        marginBottom: 2,
        color: '#757575',
    }
});