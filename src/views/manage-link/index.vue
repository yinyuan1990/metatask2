<template>
    <PageContainer title="管理连接">
        <div class="mm-text"
            style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;row-gap: 18px;">
            <div style="width: 48px;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20" />
                    <path d="M12 2a15.3 15.3 0 0 1 0 20" />
                    <path d="M12 2a15.3 15.3 0 0 0 0 20" />
                </svg>
            </div>
            <div>无连接</div>
            <div style="text-align: center;">如果您将账户连接到网站或者应用程序，您可以在此处查看s</div>
        </div>
    </PageContainer>
</template>
<script>
import PageContainer from '@/components/common/Page-Container.vue';
export default {
    components: {
        PageContainer,
    },
    data() {
        return {
        }
    }
}
</script>