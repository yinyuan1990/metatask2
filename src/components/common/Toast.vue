<template>
    <transition name="fade">
        <div v-if="visible" class="toast">
            <div class="content">
                <img class="img" :src="Check" alt="">
                <div class="toast-content mm-text">{{ message }}</div>
            </div>
        </div>
    </transition>
</template>

<script>
import Check from '@/static/icon/check.svg'
export default {
    data() {
        return {
            visible: false,
            message: '',
            Check
        };
    },
    methods: {
        show(msg = '', duration = 2000) {
            this.message = msg;
            this.visible = true;

            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.visible = false;
            }, duration);
        }
    }
};
</script>

<style scoped>
.toast {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    color: #fff;
    font-size: 14px;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.content {
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
    row-gap: 24px;
    background: rgba(0, 0, 0, 0.85);
    border-radius: 6px;
    padding: 16px 32px;
}

.img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #fff;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
