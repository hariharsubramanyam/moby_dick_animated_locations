import json
lines = open("../data/md-locations.csv").readlines()

result = []
for line in lines[1:]:
    split_line = line.replace("\n", "").split(",")
    seq_no = int(split_line[0])
    lat = float(split_line[1])
    lon = float(split_line[2])
    line_no = split_line[3]
    page_no = split_line[4]
    quote = ",".join(split_line[5:]).replace('"', "")
    result.append({
        "seq_no": seq_no,
        "lat": lat,
        "lon": lon,
        "line_no": line_no,
        "page_no": page_no,
        "quote": quote
        })

open("../data/md-locations.json", "w").write(json.dumps(result))
