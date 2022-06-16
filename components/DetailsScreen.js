import * as React from 'react';
import {Button, View, Text, StyleSheet, FlatList, TouchableHighlight, Alert} from 'react-native';
import {useEffect, useState} from "react";
import {initializeFirebase, setupGeoListener} from "../helpers/firebaseHelper";

export function DetailsScreen({ navigation }) {
    const items =  [];
    const [calculations, setCalculations] = useState(items);

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Button
                    style={styles.titleText}
                    onPress={() => {
                        onBackClicked();
                    }}
                    title="Geo Calculator"
                />
            )
        });
    }, [navigation]);

    useEffect(() => {
        try {
            initializeFirebase();
        } catch (err) {
            console.log(err)
        }
        setupGeoListener((items) => setCalculations(items));
    }, []);

    return (
        <View>
            <FlatList
                keyExtractor={(item) => item.key}
                data={calculations}
                ItemSeparatorComponent={ItemDivider}
                renderItem={({index, item}) =>
                    <TouchableHighlight
                        activeOpacity={0.6}
                        underlayColor="#DDDDDD"
                        onPress={() => onEntryClicked(item)}>
                        <View style={styles.entry}>
                            <Text style={styles.text}> Start: {item.lt1}, {item.ln1} </Text>
                            <Text style={styles.text}> End: {item.lt2}, {item.ln2}</Text>
                            <Text style={styles.footerText}> {item.date}</Text>
                        </View>
                    </TouchableHighlight>}
            ></FlatList>
        </View>

    );

    function onBackClicked() {
        navigation.navigate('Calculator');
    }

    function onEntryClicked(item) {
        navigation.navigate('Calculator', {historyItem: item});
    }
}

const ItemDivider = () => {
    return (
        <View
            style={{
                height: 1,
                width: "100%",
                backgroundColor: "#607D8B",
            }}
        />
    );
}

const styles = StyleSheet.create({
    titleText: {
        width: '100%',
        marginVertical: 5,
        marginHorizontal: 10,
        color: '#ffffff',
        elevation: 0,
    },
    entry: {
        width: '100%',
        elevation: 0,
        padding: 10
    },
    text: {
        fontSize: 16
    },
    footerText: {
        fontSize: 8,
        textAlign: 'right'
    }
});


