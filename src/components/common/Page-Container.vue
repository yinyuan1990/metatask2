<template>
    <div class="page-container--wrapper">
        <TitleBar :title="title" />
        <div class="content" :style="custonmContentStyle">
            <slot></slot>
        </div>
    </div>
</template>
<script>
import TitleBar from '@/components/common/TitleBar.vue'
export default {
    name: "PageContainer",
    components: {
        TitleBar
    },
    props: {
        title: {
            type: String,
            required: true
        },
        custonmContentStyle: {
            type: Object,
            default() {
                return {}
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.page-container--wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;

    .content {
        flex: 1;
        padding: 24px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
    }
}
</style>