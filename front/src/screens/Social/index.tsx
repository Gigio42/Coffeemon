import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSocial } from '../../hooks/useSocial';
import { useChat } from '../../hooks/useChat';
import { Friend, FriendRequest, Conversation, ChatMessage } from '../../types/social';
import { openOrCreateConversation } from '../../api/socialService';
import { styles } from './styles';
import { theme } from '../../theme/theme';
import FriendQRModal from '../../components/FriendQRModal';

const COPY_ICON = require('../../../assets/iconsv2/copy.png');
const QR_ICON = require('../../../assets/iconsv2/qr-code.png');

interface SocialScreenProps {
  token: string | null;
  playerId: number;
}

type SocialTab = 'friends' | 'chat';

// ─── Avatar ──────────────────────────────────────────────────────────────────

function AvatarPlaceholder({ username }: { username: string }) {
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{username.charAt(0).toUpperCase()}</Text>
    </View>
  );
}

// ─── Friend request card ──────────────────────────────────────────────────────

function RequestCard({
  request,
  onAccept,
}: {
  request: FriendRequest;
  onAccept: (id: number) => void;
}) {
  return (
    <View style={styles.card}>
      <View style={{ position: 'relative' }}>
        <AvatarPlaceholder username={request.fromUsername} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardUsername}>{request.fromUsername}</Text>
        <Text style={styles.cardMeta}>Quer ser seu amigo</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onAccept(request.id)}
        >
          <Text style={styles.actionButtonText}>Aceitar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Friend card ──────────────────────────────────────────────────────────────

function FriendCard({
  friend,
  onChat,
  onRemove,
}: {
  friend: Friend;
  onChat: (friend: Friend) => void;
  onRemove: (id: number) => void;
}) {
  return (
    <View style={styles.card}>
      <View style={{ position: 'relative' }}>
        <AvatarPlaceholder username={friend.username} />
        {friend.isOnline && <View style={styles.onlineDot} />}
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardUsername}>{friend.username}</Text>
        <Text style={styles.cardMeta}>
          {friend.uid} · {friend.isOnline ? 'Online' : 'Offline'}
        </Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onChat(friend)}
        >
          <Text style={styles.actionButtonText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonDanger]}
          onPress={() => onRemove(friend.id)}
        >
          <Text style={styles.actionButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Conversation card ────────────────────────────────────────────────────────

function ConversationCard({
  conversation,
  onOpen,
}: {
  conversation: Conversation;
  onOpen: (c: Conversation) => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onOpen(conversation)}>
      <AvatarPlaceholder username={conversation.friendUsername} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardUsername}>{conversation.friendUsername}</Text>
        {conversation.lastMessage ? (
          <Text style={styles.cardMeta} numberOfLines={1}>
            {conversation.lastMessage}
          </Text>
        ) : null}
      </View>
      {conversation.unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{conversation.unreadCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Chat window ──────────────────────────────────────────────────────────────

const SCROLL_BOTTOM_THRESHOLD = 80;

function ChatWindow({
  conversation,
  messages,
  isLoading,
  playerId,
  onClose,
  onSend,
}: {
  conversation: Conversation;
  messages: ChatMessage[];
  isLoading: boolean;
  playerId: number;
  onClose: () => void;
  onSend: (text: string) => void;
}) {
  const [text, setText] = useState('');
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const listRef = useRef<FlatList>(null);
  const isAtBottomRef = useRef(true);

  // Scroll to end when new messages arrive, only if already at bottom
  useEffect(() => {
    if (messages.length > 0 && isAtBottomRef.current) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    listRef.current?.scrollToEnd({ animated: true });
    setShowScrollBtn(false);
  };

  const handleScroll = (e: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;
    const atBottom = distanceFromBottom <= SCROLL_BOTTOM_THRESHOLD;
    isAtBottomRef.current = atBottom;
    setShowScrollBtn(!atBottom);
  };

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText('');
    // After sending, scroll to bottom
    isAtBottomRef.current = true;
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMine = item.senderId === playerId;
    return (
      <View
        style={[
          styles.messageBubble,
          isMine ? styles.messageBubbleMine : styles.messageBubbleTheirs,
        ]}
      >
        <Text style={[styles.messageText, isMine && styles.messageTextMine]}>
          {item.content}
        </Text>
        <Text style={[styles.messageTime, isMine && styles.messageTimeMine]}>
          {new Date(item.createdAt).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.chatOverlay}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.chatHeader}>
        <TouchableOpacity style={styles.chatBackButton} onPress={onClose}>
          <Text style={styles.chatBackText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.chatHeaderUsername}>{conversation.friendUsername}</Text>
      </View>

      {/* Messages */}
      <View style={{ flex: 1 }}>
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color={theme.colors.accent.primary} />
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            style={{ flex: 1 }}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={100}
            onContentSizeChange={() => {
              if (isAtBottomRef.current) {
                listRef.current?.scrollToEnd({ animated: false });
              }
            }}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  Nenhuma mensagem ainda.{'\n'}Diga olá!
                </Text>
              </View>
            }
          />
        )}

        {/* Scroll-to-bottom button */}
        {showScrollBtn && (
          <TouchableOpacity style={styles.scrollToBottomBtn} onPress={scrollToBottom}>
            <Text style={styles.scrollToBottomText}>↓</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Input */}
      <View style={styles.chatInputRow}>
        <TextInput
          style={styles.chatInput}
          value={text}
          onChangeText={setText}
          placeholder="Digite uma mensagem..."
          placeholderTextColor={theme.colors.text.tertiary}
          multiline
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>↑</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Friends tab ──────────────────────────────────────────────────────────────

function FriendsTab({
  social,
  onOpenChat,
  onOpenQR,
}: {
  social: ReturnType<typeof useSocial>;
  onOpenChat: (friend: Friend) => void;
  onOpenQR: () => void;
}) {
  const [uid, setUid] = useState('');

  const handleAdd = () => {
    if (!uid.trim()) return;
    social.addFriend(uid.trim());
    setUid('');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {/* Add friend */}
      <View style={styles.addFriendRow}>
        <TextInput
          style={styles.addFriendInput}
          value={uid}
          onChangeText={setUid}
          placeholder="UID do amigo"
          placeholderTextColor={theme.colors.text.tertiary}
          autoCapitalize="characters"
          maxLength={6}
        />
        <TouchableOpacity style={styles.addFriendButton} onPress={handleAdd}>
          <Text style={styles.addFriendButtonText}>+ Adicionar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.qrButton} onPress={onOpenQR}>
          <Image source={QR_ICON} style={styles.qrButtonIcon} />
        </TouchableOpacity>
      </View>

      {/* Pending requests */}
      {social.pendingRequests.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>
            Pedidos pendentes ({social.pendingRequests.length})
          </Text>
          {social.pendingRequests.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              onAccept={social.acceptRequest}
            />
          ))}
        </>
      )}

      {/* Friends list */}
      <Text style={styles.sectionTitle}>
        Amigos ({social.friends.length})
      </Text>
      {social.isLoading ? (
        <ActivityIndicator color={theme.colors.accent.primary} />
      ) : social.friends.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Você ainda não tem amigos.{'\n'}Adicione alguém acima!
          </Text>
        </View>
      ) : (
        social.friends.map((friend) => (
          <FriendCard
            key={friend.id}
            friend={friend}
            onChat={onOpenChat}
            onRemove={social.deleteFriend}
          />
        ))
      )}
    </ScrollView>
  );
}

// ─── Chat tab ─────────────────────────────────────────────────────────────────

function ChatTab({
  chat,
}: {
  chat: ReturnType<typeof useChat>;
}) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={styles.sectionTitle}>Conversas</Text>
      {chat.conversations.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            Nenhuma conversa ainda.{'\n'}Inicie um chat pela aba Amigos!
          </Text>
        </View>
      ) : (
        chat.conversations.map((conv) => (
          <ConversationCard
            key={conv.id}
            conversation={conv}
            onOpen={chat.openConversation}
          />
        ))
      )}
    </ScrollView>
  );
}

// ─── Main Social Screen ───────────────────────────────────────────────────────

export const SocialScreen: React.FC<SocialScreenProps> = ({ token, playerId }) => {
  const [activeTab, setActiveTab] = useState<SocialTab>('friends');
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const social = useSocial(token);
  const chat = useChat({
    token,
    playerId,
    onFriendOnline: (pid) => social.setFriendOnline(pid, true),
    onFriendOffline: (pid) => social.setFriendOnline(pid, false),
    onFriendRequest: (data) => social.addPendingRequest(data),
    onFriendRequestAccepted: () => social.loadFriends(),
  });

  useEffect(() => {
    social.loadFriends();
    chat.loadConversations();
  }, []);

  const handleCopyUid = async () => {
    if (!social.myUid) return;
    await Clipboard.setStringAsync(social.myUid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Open chat from friend card
  const handleOpenChatFromFriend = async (friend: Friend) => {
    const existing = chat.conversations.find((c) => c.friendId === friend.playerId);
    if (existing) {
      chat.openConversation(existing);
      setActiveTab('chat');
      return;
    }
    if (!token) return;
    try {
      const conv = await openOrCreateConversation(token, friend.playerId);
      const newConv: Conversation = {
        id: conv.id,
        friendId: friend.playerId,
        friendUid: friend.uid,
        friendUsername: friend.username,
        unreadCount: 0,
      };
      chat.openConversation(newConv);
      setActiveTab('chat');
    } catch {
      // silent — chat will open but show empty
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        {/* Linha 1: título */}
        <Text style={styles.headerTitle}>Social</Text>

        {/* Linha 2: UID sempre visível */}
        <View style={styles.uidRow}>
          <Text style={styles.uidLabel}>UID</Text>
          <View style={styles.uidChip}>
            <Text style={styles.uidChipValue}>
              {social.myUid ?? (social.isLoading ? '······' : '------')}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.copyButton, copied && styles.copyButtonDone]}
            onPress={handleCopyUid}
            activeOpacity={0.7}
            disabled={!social.myUid}
          >
            {copied ? (
              <Text style={styles.copiedText}>✓</Text>
            ) : (
              <Image source={COPY_ICON} style={styles.copyIcon} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Sub-tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'friends' && styles.tabButtonActive]}
          onPress={() => setActiveTab('friends')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'friends' && styles.tabButtonTextActive,
            ]}
          >
            Amigos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'chat' && styles.tabButtonActive]}
          onPress={() => setActiveTab('chat')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'chat' && styles.tabButtonTextActive,
            ]}
          >
            Chat
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'friends' ? (
        <FriendsTab
          social={social}
          onOpenChat={handleOpenChatFromFriend}
          onOpenQR={() => setQrModalVisible(true)}
        />
      ) : (
        <ChatTab chat={chat} />
      )}

      {/* Chat window overlay */}
      {chat.activeConversation && (
        <ChatWindow
          conversation={chat.activeConversation}
          messages={chat.messages}
          isLoading={chat.isLoadingMessages}
          playerId={playerId}
          onClose={chat.closeConversation}
          onSend={chat.sendMessage}
        />
      )}

      {/* QR Modal */}
      {social.myUid ? (
        <FriendQRModal
          visible={qrModalVisible}
          myUid={social.myUid}
          onClose={() => setQrModalVisible(false)}
          onAddByUid={(uid) => {
            social.addFriend(uid);
          }}
        />
      ) : null}
    </SafeAreaView>
  );
};
