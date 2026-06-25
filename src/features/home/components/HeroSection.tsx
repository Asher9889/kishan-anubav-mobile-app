import { Globe, Image, Leaf, MessageSquare, Mic } from 'lucide-react-native'; // Assuming Lucide icons
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

function HeroSection() {
  return (
    <View className="rounded-b-[40px] pb-8 pt-6 px-5 shadow-2xl bg-green-700">
      
      {/* Top Bar */}
      <View className="mb-8 flex-row items-center justify-between">
        {/* Left Section (Brand) */}
        <View className="flex-row items-center">
          <View className="mr-3 h-12 w-12 items-center justify-center rounded-2xl bg-white/15 border border-white/20 shadow-sm">
            <Leaf size={24} color="#FFF" />
          </View>
          <View>
            <Text className="text-xl font-black tracking-tight text-white">
              कृषि अनुभव AI
            </Text>
            <Text className="text-xs font-medium text-green-200/90 tracking-wide uppercase">
              Smart Farming Assistant
            </Text>
          </View>
        </View>

        {/* Language Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          className="flex-row items-center space-x-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md"
        >
          <Globe size={16} color="white" />
          <Text className="text-sm font-bold text-white">
            हिंदी
          </Text>
        </TouchableOpacity>
      </View>

      {/* Hero Core Content */}
      <View className="items-center mb-8">
        <Text className="text-white pt-2 text-3xl font-extrabold text-center tracking-tight pt-">
          आपका विश्वसनीय कृषि साथी
        </Text>
        <Text className="text-green-100/90 text-center text-base font-normal px-2 leading-6">
          फसल के रोग, मौसम या सिंचाई की समस्या? बस पूछें और तुरंत सही समाधान पाएं।
        </Text>
      </View>

      {/* Visual Feature Cues (Voice, Upload, Text) */}
      {/* This prepares the farmer visually for how they can interact below the hero */}
      <View className="flex-row justify-between mb-8 px-2">
        <View className="items-center flex-1">
          <View className="w-12 h-12 rounded-full bg-white/10 border border-white/15 items-center justify-center mb-2">
            <Mic size={20} color="white" />
          </View>
          <Text className="text-white text-xs font-medium">बोलकर पूछें</Text>
        </View>
        
        <View className="items-center flex-1 border-x border-white/10">
          <View className="w-12 h-12 rounded-full bg-white/10 border border-white/15 items-center justify-center mb-2">
            <Image size={20} color="white" />
          </View>
          <Text className="text-white text-xs font-medium">फोटो भेजें</Text>
        </View>

        <View className="items-center flex-1">
          <View className="w-12 h-12 rounded-full bg-white/10 border border-white/15 items-center justify-center mb-2">
            <MessageSquare size={20} color="white" />
          </View>
          <Text className="text-white text-xs font-medium">लिखकर पूछें</Text>
        </View>
      </View>

      {/* Trust Stats Card */}
      <View className="flex-row justify-around bg-stone-900/10 border border-white/10 rounded-2xl py-4 backdrop-blur-xl">
        <View className="items-center">
          <Text className="text-white font-black text-2xl tracking-tight">50K+</Text>
          <Text className="text-green-100 text-xs mt-0.5 font-medium">संतुष्ट किसान</Text>
        </View>
        <View className="w-px h-8 bg-white/20 align-self-center" />
        <View className="items-center">
          <Text className="text-white font-black text-2xl tracking-tight">2L+</Text>
          <Text className="text-green-100 text-xs mt-0.5 font-medium">सफल समाधान</Text>
        </View>
        <View className="w-px h-8 bg-white/20 align-self-center" />
        <View className="items-center">
          <Text className="text-white font-black text-2xl tracking-tight">95%</Text>
          <Text className="text-green-100 text-xs mt-0.5 font-medium">सटीक उत्तर</Text>
        </View>
      </View>

    </View>
  );
}

export default HeroSection;