import { Icon } from '@/components/ui/icon';
import {
  Sheet,
  SheetContent,
  SheetHeader
} from '@/components/ui/sheet';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { Colors } from '@/constants/theme';
import {
  Bell,
  Home,
  Plus,
  Search
} from 'lucide-react-native';

import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

import {
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import { TSheetHandle } from '../../types/types';

export const ChatHistorySheet = forwardRef<TSheetHandle>(
  function ChatHistorySheet(_, ref) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('home');

    const c = Colors.light;


    useImperativeHandle(
      ref,
      () => ({
        open: () => setIsOpen(true),
        close: () => setIsOpen(false),
        isOpen,
      }),
      [isOpen]
    );

    /**
     * Replace later with SQLite data
     */
    const navigationItems = useMemo(
      () => [

        {
          id: 'wheat',
          label: 'Wheat Discussion',
          icon: Home,
        },
        {
          id: 'weather',
          label: 'Weather Advice',
          icon: Search,
        },
        {
          id: 'disease',
          label: 'Tomato Disease',
          icon: Bell,
        }
      ],
      []
    );

    const handleItemPress = (itemId: string) => {
      setActiveItem(itemId);

      /**
       * Later:
       * setActiveChat(itemId)
       */

      setIsOpen(false);
    };

    return (

      <Sheet
        open={isOpen}
        onOpenChange={setIsOpen}
        side="left"
      >


        <SheetContent
          style={[
            styles.sheetContent,
            {
              backgroundColor: c.background,
              borderRightColor: c.border,
            },
          ]}
        >
          {/* HEADER */}
          <SheetHeader style={styles.header}>


            <Text >
              Recent Chats
            </Text>

            <Text
              style={[
                styles.description,
                { color: c.textMuted },
              ]}
            >
              Access your previous AI conversations.
            </Text>
          </SheetHeader>

          {/* NEW CHAT BUTTON */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.newChatButton,
              {
                backgroundColor: c.primary,
              },
            ]}
          >
            <Icon
              name={Plus}
              size={18}
              color="#FFFFFF"
            />

            <Text style={styles.newChatText}>
              New Chat
            </Text>
          </TouchableOpacity>

          {/* CHAT LIST */}
          <View style={styles.navigationContainer}>
            {navigationItems.map((item) => {
              const isActive =
                activeItem === item.id;

              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  style={[
                    styles.navigationItem,
                    {
                      backgroundColor: isActive
                        ? c.primaryContainer
                        : 'transparent',

                      borderColor: isActive
                        ? c.primary
                        : 'transparent',
                    },
                  ]}
                  onPress={() =>
                    handleItemPress(item.id)
                  }
                >
                  <View
                    style={[
                      styles.iconContainer,
                      {
                        backgroundColor: isActive
                          ? c.primary
                          : c.surface,
                      },
                    ]}
                  >
                    <Icon
                      name={item.icon}
                      size={18}
                      color={
                        isActive
                          ? '#FFFFFF'
                          : c.textMuted
                      }
                    />
                  </View>

                  <Text
                    numberOfLines={1}
                    style={[
                      styles.navigationText,
                      {
                        color: isActive
                          ? c.text
                          : c.textMuted,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* FOOTER */}
          <View
            style={[
              styles.footer,
              {
                borderTopColor: c.border,
              },
            ]}
          >
            <View style={styles.footerContent}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor: c.success,
                  },
                ]}
              />

              <Text
                style={[
                  styles.footerText,
                  {
                    color: c.textMuted,
                  },
                ]}
              >
                AI Assistant Online
              </Text>
            </View>
          </View>
        </SheetContent>
      </Sheet>

    );
  }
);

const styles = StyleSheet.create({
  sheetContent: {
    width: '84%',
    maxWidth: 360,
    borderRightWidth: 1,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    gap: 8,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  logoContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeText: {
    fontSize: 18,
    fontWeight: '600',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 1,
    color: "pink",
    backgroundColor: "red",
  },

  description: {
    fontSize: 14,
    lineHeight: 20,
  },

  newChatButton: {
    marginHorizontal: 20,
    marginTop: 18,
    marginBottom: 10,
    height: 52,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  newChatText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  navigationContainer: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 8,
    gap: 6,
  },

  navigationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
  },

  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  navigationText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },

  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },

  footerText: {
    fontSize: 13,
    fontWeight: '500',
  },
});