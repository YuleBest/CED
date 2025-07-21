import json
import toml
import sys

# 此脚本用于在 json 和 toml 格式之间互相转换
# 依赖:
    # toml, json
# 用法：
    # python .tomon.py json2toml input.json output.toml
    # python .tomon.py toml2json input.toml output.json
# 例子:
    # python .tomon.py toml2json 广东-肇庆-初中学业水平考试-2020.toml 广东-肇庆-初中学业水平考试-2020.json

def json_to_toml(json_path, toml_path):
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    with open(toml_path, 'w', encoding='utf-8') as f:
        toml.dump(data, f)
    print(f"Converted JSON ({json_path}) to TOML ({toml_path})")

def toml_to_json(toml_path, json_path):
    with open(toml_path, 'r', encoding='utf-8') as f:
        data = toml.load(f)
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Converted TOML ({toml_path}) to JSON ({json_path})")

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("用法: python .tomon.py [json2toml|toml2json] 输入文件 输出文件")
        sys.exit(1)

    mode, input_file, output_file = sys.argv[1], sys.argv[2], sys.argv[3]

    if mode == "json2toml":
        json_to_toml(input_file, output_file)
    elif mode == "toml2json":
        toml_to_json(input_file, output_file)
    else:
        print("参数错误，只能是 json2toml 或 toml2json")
        sys.exit(1)