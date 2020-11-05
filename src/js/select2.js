// In your Javascript (external .js resource or <script> tag)
$(function() {
  $('.select2').select2({
    placeholder: 'Silahkan pilih',
    ajax: {
      url: 'https://pokeapi.co/api/v2/pokemon',
      dataType: 'json',
      data: function (params) {
        var query = {
          limit: 25
        };

        return query
      },
      processResults: function (data) {
        return {
          results: data.results.map(function (p, idx) {
            return {
              id: idx,
              text: p.name
            }
          })
        };
      }
    }
  });
});