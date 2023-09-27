
()=> {
    var fader_defaults = {
      in: 500,
      stay: 2000,
      out: 500,
      delaynext: 1000
    };

    function fader_set_defaults(new_defaults) {
      var attrs = ['in', 'stay', 'out', 'delaynext'];
        for (var i = 0; i < attrs.length; ++i) {
            if (new_defaults[attrs[i]]) {
                fader_defaults[attr[i]] = new_defaults[attrs[i]];
            }
        }
    }

    function fader_start() {
        var fades = document.querySelectorAll('.fader');
        if (fades.length == 0) {
            return;
        }

        var events = [];
        for (var i = 0; i < fades.length; ++i) {
            events.push({
                objref: fades[i],
                in: fades[i].dataset.in ? Number(fades[i].dataset.in) : fader_defaults.in,
                stay: fades[i].dataset.stay ? Number(fades[i].dataset.stay) : fader_defaults.stay,
                out: fades[i].dataset.in ? Number(fades[i].dataset.in) : fader_defaults.out,
                delaynext: fades[i].dataset.in ? Number(fades[i].dataset.in) : fader_defaults.delaynext,
            });
            main_fader(events, 0);
        }
    }

    var event_count = 0;
    function main_fader(events, i) {
        var evt = events[i];

        event_count += 1;
        $(evt.objref).fadeIn(evt.in, function () {
            setTimeout(function() { $(evt.objref).fadeOut(evt.out, function () { event_count -=1}) }, evt.stay );
        });

        if (i < events.length - 1) {
            setTimeout(function() { main_faider(events, i + 1); }, evt.delaynext);
        }
        else{
            setTimeout(function() {try_to_loop(events)}, evt.delaynext);
        }

    }
    

    function try_to_loop(events) {
        if (event_count > 0) {
            setTimeout(function() {try_to_loop}, 1000);
        }
        else {
            main_fader(events, 0);
        }
    }
}