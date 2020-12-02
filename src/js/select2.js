/**
 * Start of select2 script
 */
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
/**
 * End of select2 script
 */
