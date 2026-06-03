// App.tsx or your screen
import { Images } from '@/assets';
import PremiumImageCarousel, { CarouselItem } from '@/components/imageCarousel';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function ImageCorousal({ news }: { news: CarouselItem[] }) {


    const colors = [
        {
            image: Images.yojna1, // Your uploaded image
            accentColor: '#C17F2E',
            backgroundColor: '#FDF8F3',
        },
        {
            image: Images.yojna2, // Your uploaded image
            accentColor: '#2E8B57',
            backgroundColor: '#F3FDF6',
        },
        {
            image: Images.yojna3, // Your uploaded image
            accentColor: '#4A90D9',
            backgroundColor: '#F3F8FD',
        },
        {
            image: Images.yojna4, // Your uploaded image
            accentColor: '#8B4513',
            backgroundColor: '#FDF6F3',
        },
    ]
        

    news.forEach((item, index) => {
        item.image = colors[index % colors.length]?.image || "";
        item.accentColor = colors[index % colors.length]?.accentColor;
        item.backgroundColor = colors[index % colors.length]?.backgroundColor;
    })


    return (

        <View style={{ marginVertical: 24 }}>
            <PremiumImageCarousel
                data={news}
                onCardPress={(item, index) => {
                    console.log('Pressed:', item.title);
                    // Navigate to detail screen
                }}
                showPagination={true}
                showProgressBar={true}
                autoPlay={true}
                loop={true}
            />

        </View>

    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
    },
});