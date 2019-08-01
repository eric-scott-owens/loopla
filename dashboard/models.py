""" Models used by the dashboard: post, comment """
import copy, json
from operator import attrgetter
from django.conf import settings
from django.core.files.storage import default_storage
from django.db import models
from django.db.models import Q
from django.db.models.signals import post_delete
from django.dispatch import receiver

from django.contrib import admin
from django.contrib.auth.models import User, Group
from django.contrib.contenttypes.fields import GenericRelation
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.postgres.fields import ArrayField
from imagekit.models import ProcessedImageField, ImageSpecField
from imagekit.processors import ResizeToFill, ResizeToFit, Transpose

from dashboard.components.photo_collection import PhotoCollectionComponent
from mptt.models import MPTTModel, TreeForeignKey
from shop.models import KudosGiven


class Category(MPTTModel):
    """
    Organizational categories for content in the system
    Categories are heirarchal where each may have children which are more specific
    """

    name = models.CharField(max_length=200)
    date_added = models.DateTimeField(auto_now_add=True)
    always_show_in_menus = models.BooleanField(default=False)

    #If this category is a subcategory of a broader category,
    #parent indicates this broader category
    parent = TreeForeignKey('self', on_delete=models.CASCADE,
                            null=True, blank=True,
                            related_name='children', db_index=True)
    
    # Efficient storage of the names of all of the ancestors to this category
    # This value is auto generated at the time the entity is saved and should
    # not be set by external code
    path_name = models.CharField(max_length=800) 

    def save(self, *args, **kwargs):
        # Generate path name
        path_name = self.name
        if self.parent:
            parent = Category.objects.get(id=self.parent.id)
            while parent:
                path_name = '%s > %s' % (parent.name, path_name)
                if parent.parent:
                    parent = Category.objects.get(id=parent.parent.id)
                else:
                    parent = None

        self.path_name = path_name

        # Save the current category
        super(Category, self).save(*args, **kwargs)

        # Update all children
        for child in self.get_children():
            child.save()

    class MPTTMeta:
        order_insertion_by = ['name']
        parent_attr = 'parent'
        left_attr = 'left'
        right_attr = 'right'

    class Meta:
        verbose_name_plural = 'categories'

    def __str__(self):
        """Return a string representation of the model."""
        return self.name

admin.site.register(Category)


HOME_TAG = int(1)
class Tag(MPTTModel):
    """
    A tag for a post, comment, or short list entry.
    Indicates the topic of discussion
    Tags are heirarchical where each tag may have children
    which are more specific tags
    Google created this tag hierarchy.
    See:
    https://cloud.google.com/natural-language/docs/classifying-text
    https://cloud.google.com/natural-language/docs/categories
    """

    name = models.CharField(max_length=200)
    date_added = models.DateTimeField(auto_now_add=True)
    #If this category is a subcategory of a broader category,
    #parent indicates this broader category
    parent = TreeForeignKey('self', on_delete=models.CASCADE,
                            null=True, blank=True,
                            related_name='children', db_index=True)

    # If tag is defined by user not by Google
    is_user_generated = models.BooleanField(default=False)

    categories = models.ManyToManyField(Category)

    class MPTTMeta:
        order_insertion_by = ['name']
        parent_attr = 'parent'

    class Meta:
        verbose_name_plural = 'tags'

    def __str__(self):
        """Return a string representation of the model."""
        return self.name

admin.site.register(Tag)


class UserDefinedTag(models.Model):
    #################################################
    #################################################
    #################################################
    #  UserDefinedTag is deprecated. Use tag instead.
    #################################################
    #################################################
    #################################################
    """
    A tag for a post, comment, or short list entry.
    Indicates the topic of discussion

    This is a tag defined by a user rather by Google
    These tags are organized as a list
    """

    name = models.CharField(max_length=200)
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'user_defined_tags'
        ordering = ['name']

    def __str__(self):
        """Return a string representation of the model."""
        return self.name

admin.site.register(UserDefinedTag)


class Place(models.Model):
    # If place is defined by user not by Google
    date_added = models.DateTimeField(auto_now_add=True)
    is_user_generated = models.BooleanField(default=False) # false if Name is a Google Place ID
    # If place is defined by google than this name is a 'google place id'
    # otherwise it is the actual name assigend by the user
    name = models.CharField(max_length=130)


class ShortList (models.Model):
    date_added = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    places = models.ManyToManyField(Place)
    # The next two fields are replaced by 'places' and should be
    # removed soon.
    # Google place_id.
    # See https://googlemaps.github.io/google-maps-services-python/docs/
    place_id  = models.CharField(max_length=80, blank=True)
    # holds a text representation of the place if place_id doesn't exist
    # (because business is not listed on Google)
    place  = models.CharField(max_length=80, blank=True)
    title = models.CharField(max_length=30)
    short_description = models.CharField(max_length=200, blank=True)
    contact_information = models.CharField(max_length=120, blank=True)

    # Link to a post or comment for further info.
    content_type = models.ForeignKey(ContentType, null=True, on_delete=models.SET_NULL)
    object_id = models.PositiveIntegerField(blank=True, null=True)
    content_object = GenericForeignKey('content_type', 'object_id')

    # Tags associated with entry

    # Tags from Google taxonomy of categories
    tags = models.ManyToManyField(Tag)

    # Tags that are specified by user (and are not in Google Taxonomy)
    # user_defined_tags is deprecated. Use tags instead.
    user_defined_tags = models.ManyToManyField(UserDefinedTag) 

    # To be replaced by user_defined_tags
    tags_user_generated  = ArrayField(models.CharField(max_length=80), blank=True, null=True)

    kudos = models.ManyToManyField(User, related_name='short_list_appreciator')

    def __str__(self):
        """Return a string representation of the model."""
        return str(self.place_id)

    class Meta:
        ordering = ['date_added']

class Post(models.Model):
    """A post for the specified topic/category"""
    summary = models.CharField(max_length=60)
    text = models.TextField()
    text_rich_json = models.TextField(blank=True, null=True)
    date_added = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    is_deleted = models.BooleanField(default=False)
    date_deleted = models.DateTimeField(blank=True, null=True)

    # Initially, set to the date/time this post was created
    date_last_comment_added = models.DateTimeField(auto_now_add=True)
    # If owner is deleted, the owner's posts are deleted, too
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    # If group is deleted, the group's posts are deleted, too
    # Probably want to give users a chance to export their data
    # before group deletion
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    public_comment_count = models.PositiveIntegerField(default=0)
    private_comment_count = models.PositiveIntegerField(default=0)
    kudos = models.ManyToManyField(User, related_name='post_appreciator') # To be replaced by kudos_received
    short_list_entries = GenericRelation(ShortList)
    newest_update = models.DateTimeField(auto_now=True, db_index=True)
    # Places associated with post
    places = models.ManyToManyField(Place)
    # The next two fields are replaced by 'places' and should be
    # removed soon.

    # Id numbers for places that have a Google listing
    place_id  = ArrayField(models.CharField(max_length=80), blank=True, null=True)
    # Names of places that do *not* have a Google listing
    place_user_generated  = ArrayField(models.CharField(max_length=80), blank=True, null=True)

    # Tags associated with post

    # Tags from Google taxonomy of categories
    tags = models.ManyToManyField(Tag)
    
    # Tags that are specified by user (and are not in Google Taxonomy)
    # user_defined_tags is deprecated. Use tags instead.
    user_defined_tags = models.ManyToManyField(UserDefinedTag)
    
    # To be replaced by user_defined_tags
    tags_user_generated  = ArrayField(models.CharField(max_length=80), blank=True, null=True)

    kudos_received = GenericRelation(KudosGiven)


    # Categories
    categories = models.ManyToManyField(Category)

    """
    Components
    """
    photo_collections = GenericRelation(PhotoCollectionComponent)

    def clone(self):
        cloned_post = copy.deepcopy(self)
        return cloned_post

    def get_reference(self):
        return {
            'id': self.id,
            'owner_id': self.owner.id,
            'newest_update': self.newest_update
        }

    def get_all_categories(self):
        """
        Returns a unique set of all categories used by this post
        or one of it's child comments.
        """
        categories = {}
        
        for category in self.categories.all():
            categories[category.id] = category
        
        for comment in self.comments.filter(is_deleted=False):
            for category in comment.categories.all():
                categories[category.id] = category

        unique_categories = []
        for key in categories:
            unique_categories.append(categories[key])

        return unique_categories

        

    class Meta:
        verbose_name_plural = 'posts'

    def __str__(self):
        """Return a string representation of the model.
        Should probably be broken on a word rather than a character """
        return self.text[:50] + "..."



class Comment(models.Model):
    """A comment on a specific post"""
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    summary = models.CharField(max_length=80, blank=True)
    text = models.TextField()
    text_rich_json = models.TextField(blank=True, null=True)
    date_added = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    is_deleted = models.BooleanField(default=False)
    date_deleted = models.DateTimeField(blank=True, null=True)

    # If owner is deleted, the owner's comments are deleted, too
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    is_private = models.BooleanField(default=False)
    kudos = models.ManyToManyField(User, related_name='comment_appreciator')

    short_list_entries = GenericRelation(ShortList)
    # Places associated with post
    places = models.ManyToManyField(Place)
    # The next two fields are replaced by 'places' and should be
    # removed soon.
    # Id numbers for places that have a Google listing
    place_id  = ArrayField(models.CharField(max_length=80), blank=True, null=True)
    # Names of places that do *not* have a Google listing
    place_user_generated  = ArrayField(models.CharField(max_length=80), blank=True, null=True)

    # Tags associated with comment

    # Tags from Google taxonomy of categories
    tags = models.ManyToManyField(Tag)

    # Tags that are specified by user (and are not in Google Taxonomy)
    # user_defined_tags is deprecated. Use tags instead.
    user_defined_tags = models.ManyToManyField(UserDefinedTag)
    
    # To be replaced by user_defined_tags
    tags_user_generated  = ArrayField(models.CharField(max_length=80), blank=True, null=True)

    # Categories
    categories = models.ManyToManyField(Category)

    kudos_received = GenericRelation(KudosGiven)


    """
    Components
    """
    photo_collections = GenericRelation(PhotoCollectionComponent)


    class Meta:
        verbose_name_plural = 'comments'

    def __str__(self):
        """Return a string representation of the model."""
        return self.text[:50] + "..."

class UserFeedback(models.Model):
    owner = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    text = models.TextField()
    photo_collections = GenericRelation(PhotoCollectionComponent)


admin.site.register(UserFeedback)



class CategoryStatistics(models.Model):
    category = models.ForeignKey(Category, null=True)
    group = models.ForeignKey(Group, null=True)
    post_count = models.PositiveIntegerField(default=0)
    post_references =  models.TextField()

    @staticmethod
    def post_reference_get_newest_update(post):
        newest_update = None
        
        if 'newest_update' in post:
            newest_update = str(post['newest_update'])
        else: 
            newest_update = str(post.newest_update)
        
        return newest_update
        

    def get_post_references(self):
        post_references = json.loads(self.post_references)
        return post_references

    def set_post_references(self, post_references):
        post_references.sort(key=CategoryStatistics.post_reference_get_newest_update)
        post_references_json = json.dumps(post_references, default=str)
        self.post_references = post_references_json
        self.post_count = len(post_references)
        

    def remove_post_from_statistic(self, post):
        post_references = self.get_post_references()
        post_reference = None

        for current_post_reference in post_references:
            if current_post_reference['id'] == post.id:
                post_reference = current_post_reference
                break
        
        if post_reference:
            post_references.remove(post_reference)
            self.set_post_references(post_references)
            self.save()
        else:
            raise Exception('Specified post was not found in this category statistic')

    def add_post_to_statistic(self, post):
        post_references = self.get_post_references()
        post_reference = None

        for current_post_reference in post_references:
            if current_post_reference['id'] == post.id:
                post_reference = current_post_reference
                break
        
        if not post_reference:
            post_references.append(post.get_reference())
            self.set_post_references(post_references)
            self.save()

    @staticmethod
    def detect_changes_between_category_collections(starting_categories, ending_categories):
        """
        detects changes to the category statistics given a change to a collection of categories

        Parameters
        ----------        
        starting_categories : category[]
            The original categories, prior to updating, against which comparisons should be made.
            This value should be None in the event a post has just been created.
        ending_categories : category[]
            The final categories against which comparisons should be made. This value
            should be None in the event the post has just been deleted.
        """
        # Detect the changes in counts
        category_statistic_changes = {}
    
        if starting_categories:
            # count negatives for categories in the original (which may be removed)
            # Posts and child comments only count once in the statistics
            #
            # We start by assuming all categories will be removed. The next section 
            # will detect which stay and which are added
            for category in starting_categories:
                category_statistic_changes[category.id] = -1
    
        if ending_categories:
            # count positives for categories in the updated (which may be added)
            # For category statistics that don't change, the change tracker will
            # move to 0. For those that are added it will move to 1
            for category in ending_categories:
                if category.id not in category_statistic_changes:
                    category_statistic_changes[category.id] = 1
                elif category_statistic_changes[category.id] == -1:
                    category_statistic_changes[category.id] = 0

        return category_statistic_changes

    @staticmethod
    def apply_category_statistic_changes(group, post, category_statistic_changes):
        # Process the changes to the statistics
        for category_id, value in category_statistic_changes.items():
            if value == -1:
                category_statistic = CategoryStatistics.objects.get(group=group,category__id=category_id)
                category_statistic.remove_post_from_statistic(post)
            elif value == 1:
                category_statistic = CategoryStatistics.objects.get(group=group,category__id=category_id)
                category_statistic.add_post_to_statistic(post)

        # Update the group wide statistics
        group_category_statistic = CategoryStatistics.objects.get(group=group,category=None)
        if post.is_deleted:
            group_category_statistic.remove_post_from_statistic(post)
        else:
            group_category_statistic.add_post_to_statistic(post)


    @staticmethod
    def extend_category_collection_to_include_parents(category_collection):
        if not category_collection:
            category_collection = []
            
        categories = {}
        for category in category_collection:
            categories[category.id] = category
            if category.parent:
                categories[category.parent.id] = category.parent

        unique_categories = list(categories.values())
        return unique_categories


    @staticmethod
    def update_statistics_for_post_change(group, post, starting_categories, ending_categories):
        """
        Updates the category statistics give a change to a post or its comments

        Parameters
        ----------  
        group: Group
        post: Post      
        original_post : Post
            The original post, prior to updating, against which comparisons should be made.
            This value should be None in the event the post has just been created.
        updated_post : Post
            The final value of the post against which comparisons should be made. This value
            should be None int he event the post has just been deleted.1
        """
        starting_categories_with_parents = CategoryStatistics.extend_category_collection_to_include_parents(starting_categories)
        ending_categories_with_parents = CategoryStatistics.extend_category_collection_to_include_parents(ending_categories)
        category_statistic_changes = CategoryStatistics.detect_changes_between_category_collections(starting_categories_with_parents, ending_categories_with_parents)
        CategoryStatistics.apply_category_statistic_changes(group, post, category_statistic_changes)


    @staticmethod
    def calculate_statistics_for(category, group):
        statistic = None
        if CategoryStatistics.objects.filter(category=category, group=group).exists():
            statistic = CategoryStatistics.objects.get(category=category, group=group)
        else:
            statistic = CategoryStatistics(category=category, group=group)

        posts = None
        if category: 
            posts = Post.objects.filter(
                Q(group=group) & (
                    Q(categories__in=[category]) |
                    Q(categories__parent__in=[category]) |
                    Q(comments__categories__in=[category]) |
                    Q(comments__categories__parent__in=[category])
                )
            ).distinct('id','newest_update').order_by('newest_update').values('id', 'owner_id', 'newest_update')
        else:
            posts = Post.objects.filter(group=group, is_deleted=False).distinct('id','newest_update').order_by('newest_update').values('id', 'owner_id', 'newest_update')

        posts = list(posts)
        statistic.post_count = len(posts)
        post_references_json = json.dumps(posts, default=str)
        statistic.post_references = post_references_json
        statistic.save()
        
    @staticmethod
    def calculate_statistics_for_group(group):
        categories = Category.objects.all()
        for category in categories:
            CategoryStatistics.calculate_statistics_for(category, group)

        CategoryStatistics.calculate_statistics_for(None, group)


    @staticmethod
    def calculate_statistics():
        groups = Group.objects.all()
        categories = Category.objects.all()
        for group in groups:
            for category in categories:
                CategoryStatistics.calculate_statistics_for(category, group)

            CategoryStatistics.calculate_statistics_for(None, group)

