import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

const RadioButton = ({ options, selectedOption, onSelect }) => {
    return (
      <View style={{flexDirection:'row',marginTop:10}}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => onSelect(option)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft:10
            }}
          >
            <View
              style={{
                height: 20,
                width: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: selectedOption === option ? 'blue' : 'gray',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {selectedOption === option && (
                <View
                  style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: 'blue',
                  }}
                />
              )}
            </View>
            <Text style={{ marginLeft:5 ,color:'black'}}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  export default RadioButton