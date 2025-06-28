<script setup lang="ts">
interface Feature {
  title: string
  description: string
  icon: string
}

const router = useRouter()
const isLoading = ref(true)
const heroImage = ref<HTMLImageElement | null>(null)

onMounted(() => {
  // Simulate loading time and then hide skeleton
  setTimeout(() => {
    isLoading.value = false
  }, 300)
})

const features = ref<Feature[]>([
  {
    title: 'Trình chiếu Tương tác',
    description: 'Tạo slide trình chiếu với nội dung văn bản, hình ảnh, video và câu hỏi trắc nghiệm tương tác',
    icon: 'IconPublic',
  },
  {
    title: 'Thời gian Thực',
    description: 'Điều khiển slide từ xa, người tham gia luôn đồng bộ trạng thái và phản hồi tức thì',
    icon: 'IconChannel',
  },
  {
    title: 'Chấm điểm & Xếp hạng',
    description: 'Hệ thống chấm điểm tự động và bảng xếp hạng trực tiếp trong vòng vài giây',
    icon: 'IconGroup',
  },
  {
    title: 'Tham gia dễ dàng',
    description: 'Người tham gia chỉ cần mã PIN, không cần tài khoản, hỗ trợ mọi thiết bị',
    icon: 'IconJoin',
  },
  {
    title: 'Phân tích & Báo cáo',
    description: 'Thống kê chi tiết số lượt tham gia, điểm số và lưu lịch sử buổi trình chiếu',
    icon: 'IconReport',
  },
  {
    title: 'Quản lý Phân quyền',
    description: 'Hệ thống vai trò rõ ràng từ khách vãng lai đến quản trị viên với tính năng bảo mật cao',
    icon: 'IconGroup',
  },
])
</script>

<template>
  <div class="min-h-screen overflow-x-hidden">
    <!-- Hero Section with Animated Background -->
    <section class="relative overflow-hidden bg-gradient-to-b from-background via-background/90 to-background/50 py-16 md:py-32">
      <!-- Animated background elements -->
      <div class="absolute inset-0 overflow-hidden">
        <div class="animate-float absolute -top-4 -right-4 w-72 h-72 bg-primary/40 rounded-full blur-3xl" />
        <div class="animate-float-delayed absolute -bottom-8 -left-8 w-96 h-96 bg-secondary/40 rounded-full blur-3xl" />
      </div>

      <div class="container relative mx-auto px-4">
        <div class="flex flex-col items-center text-center gap-8 md:gap-12">
          <!-- Logo with Skeleton and Fade -->
          <div class="w-64 h-24 relative transition-all duration-700 ease-out transform" :class="isLoading ? 'opacity-50 scale-95' : 'opacity-100 scale-100'">
            <Skeleton v-if="isLoading" class="w-full h-full animate-pulse" />
            <img
              v-else
              ref="heroImage"
              src="@/assets/images/Logo_Slooh_Horizontal.png"
              alt="Slooh Logo"
              class="w-full h-full object-contain drop-shadow-lg"
            >
          </div>

          <!-- Hero Text with Slide-up Animation -->
          <div class="space-y-6 max-w-4xl transition-all duration-700 ease-out transform" :class="isLoading ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'">
            <h1 class="text-4xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary via-slate-500 to-primary bg-clip-text text-transparent">
              Chào mừng đến với Slooh
            </h1>

            <h2 class="text-2xl md:text-3xl font-semibold text-primary/80 mb-4">
              Trình chiếu tương tác thế hệ mới
            </h2>

            <p class="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Nền tảng trình chiếu kết hợp trò chơi hỏi đáp trực tiếp theo thời gian thực,
              giúp bạn tạo các buổi trình bày sinh động và tương tác
            </p>

            <div class="flex flex-wrap justify-center gap-2 md:gap-4 text-sm md:text-base text-muted-foreground/80 mt-6">
              <span class="flex items-center gap-1">
                <Icon name="IconCheck" class="w-4 h-4 text-green-500" />
                Thay thế PowerPoint truyền thống
              </span>
              <span class="flex items-center gap-1">
                <Icon name="IconCheck" class="w-4 h-4 text-green-500" />
                Tăng sự gắn kết người nghe
              </span>
              <span class="flex items-center gap-1">
                <Icon name="IconCheck" class="w-4 h-4 text-green-500" />
                Phù hợp dạy học & hội thảo
              </span>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" class="text-lg px-8 py-6 transform hover:scale-105 transition-transform" @click="router.push('/auth/login')">
                Bắt đầu ngay
              </Button>
              <Button size="lg" variant="outline" class="text-lg px-8 py-6 backdrop-blur transform hover:scale-105 transition-transform" @click="router.push('/PublicRoom')">
                Khám phá phòng công khai
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section with Staggered Animation -->
    <section class="py-24 bg-gradient-to-b from-muted/30 to-background relative overflow-hidden">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-5xl font-bold text-center mb-16 transition-all duration-700 ease-out transform" :class="isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'">
          Tại sao chọn Slooh?
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          <div
            v-for="(feature, index) in features"
            :key="feature.title"
            class="group p-8 rounded-xl bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
            :class="isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'"
            :style="{ transitionDelay: `${index * 150}ms` }"
          >
            <div v-if="isLoading" class="space-y-4">
              <Skeleton class="w-16 h-16 rounded-lg" />
              <Skeleton class="w-3/4 h-8" />
              <Skeleton class="w-full h-20" />
            </div>
            <template v-else>
              <div class="rounded-lg p-4 bg-primary/10 inline-block transform group-hover:scale-110 transition-transform">
                <component
                  :is="feature.icon"
                  class="w-12 h-12 text-primary"
                />
              </div>
              <h3 class="text-2xl font-semibold mt-6 group-hover:text-primary transition-colors">
                {{ feature.title }}
              </h3>
              <p class="mt-4 text-muted-foreground text-lg leading-relaxed">
                {{ feature.description }}
              </p>
            </template>
          </div>
        </div>
      </div>
    </section>

    <!-- How it Works Section -->
    <section class="py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-5xl font-bold text-center mb-16">
          Quy trình sử dụng đơn giản
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
          <!-- Step indicators -->
          <div class="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 transform -translate-y-1/2" />

          <div
            v-for="step in [
              { number: '1', title: 'Đăng ký', desc: 'Tạo tài khoản miễn phí', icon: 'IconUser' },
              { number: '2', title: 'Tạo phòng', desc: 'Thiết lập phòng trình chiếu mới', icon: 'IconPlus' },
              { number: '3', title: 'Thêm nội dung', desc: 'Tạo slide và câu hỏi tương tác', icon: 'IconEdit' },
              { number: '4', title: 'Bắt đầu', desc: 'Chia sẻ mã PIN cho người tham gia', icon: 'IconPlay' },
              { number: '5', title: 'Tương tác', desc: 'Xem kết quả và thống kê realtime', icon: 'IconReport' },
            ]"
            :key="step.number"
            class="flex flex-col items-center text-center relative z-10"
          >
            <div class="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4 shadow-lg">
              {{ step.number }}
            </div>
            <h3 class="text-xl font-semibold mb-2">
              {{ step.title }}
            </h3>
            <p class="text-muted-foreground text-sm">
              {{ step.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Target Users Section -->
    <section class="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-5xl font-bold text-center mb-16">
          Ai có thể sử dụng Slooh?
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="user in [
              { title: 'Giáo viên', desc: 'Dạy học tương tác, kiểm tra hiểu bài theo thời gian thực', icon: '👨‍🏫' },
              { title: 'Nhân sự', desc: 'Đào tạo nội bộ, onboarding nhân viên mới', icon: '👩‍💼' },
              { title: 'Diễn giả', desc: 'Workshop, hội thảo, thuyết trình chuyên nghiệp', icon: '🧑‍💻' },
              { title: 'Học sinh - Sinh viên', desc: 'Thuyết trình nhóm, báo cáo học tập', icon: '🎓' },
              { title: 'Event Organizer', desc: 'Tổ chức game show, hoạt động tập thể', icon: '🎉' },
              { title: 'Doanh nghiệp', desc: 'Meeting, training, team building', icon: '🏢' },
            ]"
            :key="user.title"
            class="group p-6 rounded-xl bg-card/50 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1"
          >
            <div class="text-4xl mb-4">
              {{ user.icon }}
            </div>
            <h3 class="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
              {{ user.title }}
            </h3>
            <p class="text-muted-foreground">
              {{ user.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Technology Features Section -->
    <section class="py-24 bg-gradient-to-b from-background to-muted/30">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl md:text-5xl font-bold text-center mb-16">
          Công nghệ hiện đại
        </h2>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon name="IconPlay" class="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-2">
                  Thời gian thực (Real-time)
                </h3>
                <p class="text-muted-foreground">
                  Công nghệ Socket.IO đồng bộ slide tức thì, phản hồi trong vòng vài giây
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon name="IconEyeOn" class="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-2">
                  Giao diện hiện đại
                </h3>
                <p class="text-muted-foreground">
                  Thiết kế tối giản, kéo thả đơn giản, hỗ trợ mọi thiết bị
                </p>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon name="IconReport" class="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 class="text-xl font-semibold mb-2">
                  Phân tích thông minh
                </h3>
                <p class="text-muted-foreground">
                  Thống kê chi tiết, báo cáo tự động, phát hiện vi phạm
                </p>
              </div>
            </div>
          </div>

          <div class="relative">
            <div class="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20 flex items-center justify-center">
              <img
                src="@/assets/images/introduce/presenting-content.webp"
                alt="Technology Demo"
                class="w-full h-full object-cover rounded-2xl shadow-lg"
              >
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-24 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-5xl font-bold mb-8">
          Sẵn sàng bắt đầu với Slooh?
        </h2>
        <p class="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Tham gia cùng hàng nghìn người dùng đang tạo ra những buổi trình chiếu tương tác tuyệt vời
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" class="text-lg px-8 py-6" @click="router.push('/auth/register')">
            Đăng ký miễn phí
          </Button>
          <Button size="lg" variant="outline" class="text-lg px-8 py-6" @click="router.push('/auth/login')">
            Đăng nhập
          </Button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.container {
  max-width: 1280px;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-20px) scale(1.1);
    opacity: 0.7;
  }
}

@keyframes float-delayed {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translateY(20px) scale(1.1);
    opacity: 0.7;
  }
}

.animate-float {
  animation: float 8s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
  animation-delay: -4s;
}
</style>
