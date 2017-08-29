<script type="text/javascript">
  var vk_ret = 1;
  var rtrg_id = 'Place Id Here'
  window.vkAsyncInit = function()
  {
    if(vk_ret)
    {
      VK.Retargeting.Init(rtrg_id);
      VK.Retargeting.Hit();
      console.log("VK Retargeting Initiated")
      vk_ret = 0
    }
  };

  var vk_tr = document.createElement('div');
  vk_tr.setAttribute('id', 'vk_api_transport');
  document.body.appendChild(vk_tr);
	
  setTimeout(function()
  {
    var el = document.createElement("script");
      el.type = "text/javascript";
      el.src = "https://vk.com/js/api/openapi.js?144";
      el.async = true;
    document.getElementById("vk_api_transport").appendChild(el);
  }, 0);
</script>
