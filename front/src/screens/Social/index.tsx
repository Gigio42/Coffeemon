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
const PEOPLE_ICON = require('../../../assets/iconsv2/people.png');

interface SocialScreenProps {
  token: string | null;
  playerId: number;
  userId?: number;
  isGuest?: boolean;
  onLogout?: () => void;
}

type SocialTab = 'friends' | 'chat';

// ─── Avatar ──────────────────────────────────────────────────────────────────

function AvatarPlaceholder({ username, size = 42 }: { username: string; size?: number }) {
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.avatarText, size > 42 && { fontSize: 24 }]}>
        {username.charAt(0).toUpperCase()}
      </Text>
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
      <AvatarPlaceholder username={request.fromUsername} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardUsername}>{request.fromUsername}</Text>
        <Text style={styles.cardMeta}>Quer ser seu amigo</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => onAccept(request.id)}>
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
        <TouchableOpacity style={styles.actionButton} onPress={() => onChat(friend)}>
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
    isAtBottomRef.current = distanceFromBottom <= SCROLL_BOTTOM_THRESHOLD;
    setShowScrollBtn(!isAtBottomRef.current);
  };

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText('');
    isAtBottomRef.current = true;
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMine = item.senderId === playerId;
    return (
      <View style={[styles.messageBubble, isMine ? styles.messageBubbleMine : styles.messageBubbleTheirs]}>
        <Text style={[styles.messageText, isMine && styles.messageTextMine]}>{item.content}</Text>
        <Text style={[styles.messageTime, isMine && styles.messageTimeMine]}>
          {new Date(item.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.chatOverlay}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.chatHeader}>
        <TouchableOpacity style={styles.chatBackButton} onPress={onClose}>
          <Text style={styles.chatBackText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.chatHeaderUsername}>{conversation.friendUsername}</Text>
      </View>

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
              if (isAtBottomRef.current) listRef.current?.scrollToEnd({ animated: false });
            }}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Nenhuma mensagem ainda.{'\n'}Diga olá!</Text>
              </View>
            }
          />
        )}
        {showScrollBtn && (
          <TouchableOpacity style={styles.scrollToBottomBtn} onPress={scrollToBottom}>
            <Text style={styles.scrollToBottomText}>↓</Text>
          </TouchableOpacity>
        )}
      </View>

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
  isGuest,
  onOpenChat,
  onOpenQR,
  onCreateAccount,
}: {
  social: ReturnType<typeof useSocial>;
  isGuest?: boolean;
  onOpenChat: (friend: Friend) => void;
  onOpenQR: () => void;
  onCreateAccount: () => void;
}) {
  const [uid, setUid] = useState('');

  if (isGuest) {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.guestBanner}>
          <Image source={PEOPLE_ICON} style={styles.guestBannerIcon} />
          <Text style={styles.guestBannerTitle}>Faça parte da comunidade</Text>
          <Text style={styles.guestBannerSubtitle}>
            Crie uma conta gratuita para adicionar amigos, trocar mensagens e participar das batalhas em grupo.
          </Text>
          <TouchableOpacity style={styles.guestBannerButton} onPress={onCreateAccount}>
            <Text style={styles.guestBannerButtonText}>Criar conta gratuita</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  const handleAdd = () => {
    if (!uid.trim()) return;
    social.addFriend(uid.trim());
    setUid('');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
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

      {social.pendingRequests.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Pedidos pendentes ({social.pendingRequests.length})</Text>
          {social.pendingRequests.map((req) => (
            <RequestCard key={req.id} request={req} onAccept={social.acceptRequest} />
          ))}
        </>
      )}

      <Text style={styles.sectionTitle}>Amigos ({social.friends.length})</Text>
      {social.isLoading ? (
        <ActivityIndicator color={theme.colors.accent.primary} />
      ) : social.friends.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Você ainda não tem amigos.{'\n'}Adicione alguém acima!</Text>
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

function ChatTab({ chat }: { chat: ReturnType<typeof useChat> }) {
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
          <ConversationCard key={conv.id} conversation={conv} onOpen={chat.openConversation} />
        ))
      )}
    </ScrollView>
  );
}

// ─── Main Social Screen ───────────────────────────────────────────────────────

export const SocialScreen: React.FC<SocialScreenProps> = ({
  token,
  playerId,
  userId,
  isGuest,
  onLogout,
}) => {
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
      // silencioso
    }
  };

  const tabs: { key: SocialTab; label: string }[] = [
    { key: 'friends', label: 'Amigos' },
    { key: 'chat',    label: 'Chat' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Social</Text>
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
            {copied
              ? <Text style={styles.copiedText}>✓</Text>
              : <Image source={COPY_ICON} style={styles.copyIcon} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Sub-tabs */}
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabButton, activeTab === tab.key && styles.tabButtonActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabButtonText, activeTab === tab.key && styles.tabButtonTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {activeTab === 'friends' && (
        <FriendsTab
          social={social}
          isGuest={isGuest}
          onOpenChat={handleOpenChatFromFriend}
          onOpenQR={() => setQrModalVisible(true)}
          onCreateAccount={onLogout ?? (() => {})}
        />
      )}
      {activeTab === 'chat' && <ChatTab chat={chat} />}

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
          onAddByUid={(uid) => social.addFriend(uid)}
        />
      ) : null}
    </SafeAreaView>
  );
};
