<template>
    <div>

    </div>
</template>

<script>
    import request from '../../utils/request';
    export default {
        data() {
            return {

            }
        },
        methods: {
            open(){
                window.window.open(request.baseUrl + '/doc.html',"_blank");
            }
        },
        created() {
            this.open();
        }
    }
</script>

<style>

</style>
