from pdb import set_trace as bp
from django.contrib.staticfiles.storage import staticfiles_storage
import os
from django.conf import settings
import random


def get_random_monster():
    r1 = lambda: random.randint(0,2)
    monster = r1()

    r = lambda: random.randint(0,255)
    new_color_1 = '#%02X%02X%02X' % (r(),r(),r())
    new_color_2 = '#%02X%02X%02X' % (r(),r(),r())

    if monster == 0:
        fp = staticfiles_storage.open('api_v1/default_user_profile_images/monster_templates_1/WalkingMonster.svg')
        file_string = fp.read()
        fp.close()

        index_st1 = file_string.find(b"#")
        index_st2 = file_string.find(b"#", index_st1 + 1)
        index_st3 = file_string.find(b"#", index_st2 + 1)
        index_st3 = file_string.find(b"#", index_st3 + 1)

        file_string = file_string[:index_st2] + new_color_1.encode() + file_string[index_st2 + len(new_color_1):index_st3] + new_color_2.encode() + file_string[index_st3 + len(new_color_2):]

    elif monster == 1:
        fp = staticfiles_storage.open('api_v1/default_user_profile_images/monster_templates_1/FurryMonster.svg')
        file_string = fp.read()
        fp.close()

        index_st0 = file_string.find(b"#")
        index_st1 = file_string.find(b"#", index_st0 + 1)
        index_st2 = file_string.find(b"#", index_st1 + 1)
        index_st3 = file_string.find(b"#", index_st2 + 1)

        file_string = file_string[:index_st0] + new_color_1.encode() + file_string[index_st0 + len(new_color_1):index_st2] + new_color_2.encode() + file_string[index_st2 + len(new_color_2):]

    else:
        fp = staticfiles_storage.open('api_v1/default_user_profile_images/monster_templates_1/HugMonster4.1.svg')
        file_string = fp.read()
        fp.close()

        index_st0 = file_string.find(b"#")
        index_st1 = file_string.find(b"#", index_st0 + 1)
        index_st2 = file_string.find(b"#", index_st1 + 1)

        file_string = file_string[:index_st0] + new_color_1.encode() + file_string[index_st0 + len(new_color_1):index_st2] + new_color_2.encode() + file_string[index_st2 + len(new_color_2):]

    return (file_string)



